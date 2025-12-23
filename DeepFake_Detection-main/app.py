from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
import cv2
import os
from werkzeug.utils import secure_filename
import webbrowser
import logging

# Setup Flask app
app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), "My_model3.keras")
try:
    if not os.path.exists(model_path):
        logging.error(f"Model file not found at {model_path}")
        raise FileNotFoundError(f"Model file not found at {model_path}")
    model = tf.keras.models.load_model(model_path, compile=False)
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.exception(f"Failed to load model: {e}")
    model = None

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Home route renders index.html from templates/
@app.route("/")
def home():
    return render_template("index.html")

# Extract frames from video
def extract_frames(video_path, frame_size=128, frames_per_video=20):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    sample_interval = max(1, total_frames // frames_per_video)
    frames = []

    for i in range(frames_per_video):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * sample_interval)
        ret, frame = cap.read()
        if ret:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (frame_size, frame_size))
            frame = frame.astype('float32') / 255.0
            frames.append(frame)

    cap.release()
    return np.array(frames) if frames else None

# Deepfake prediction logic
def detect_deepfake(video_path, model, frame_size=128, frames_per_video=20):
    frames = extract_frames(video_path, frame_size, frames_per_video)
    if frames is None:
        return None, None

    frames = np.expand_dims(frames, axis=-1)
    predictions = model.predict(frames)
    avg_prediction = np.mean(predictions, axis=0)
    is_fake = avg_prediction[1] > 0.5
    confidence = avg_prediction[1] if is_fake else avg_prediction[0]
    return is_fake, confidence

# Upload route for video
@app.route("/upload", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    video = request.files["video"]
    filename = secure_filename(video.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    video.save(filepath)

    if model is None:
        return jsonify({"error": "Model is not loaded properly. Cannot analyze video."}), 500

    is_fake, confidence = detect_deepfake(filepath, model)

    if is_fake is None:
        return jsonify({"error": "Failed to analyze video"}), 500

    return jsonify({
        "is_fake": str(is_fake),
        "confidence": round(float(confidence) * 100, 2)
    })

# Launch app
if __name__ == "__main__":
    webbrowser.open("http://127.0.0.1:5000")
    app.run(debug=True)