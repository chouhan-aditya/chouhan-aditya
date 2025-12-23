# DeepFake_Detection

📌 Deepfake Detection System
Welcome to the Deepfake Detection System – a project built to identify AI-generated manipulated videos using a powerful hybrid of machine learning and deep learning models.

🔍 Project Overview
This project addresses the growing threat of deepfakes, which are increasingly used to spread misinformation and manipulate public opinion. Our system aims to detect face-swapped videos with high accuracy using spatial and temporal features from video data.

🧠 Model Architecture
CNN (Convolutional Neural Network): Extracts spatial features from video frames, focusing on facial artifacts, texture inconsistencies, and pixel-level details.

LSTM (Long Short-Term Memory): Analyzes the temporal dynamics, capturing inconsistencies in motion like blinking, lip-sync issues, and facial movements.

(Optionally uses Capsule Networks for improved spatial hierarchy detection.)

💻 Tech Stack
Component	Technology
Frontend	React.js
Backend	Flask (Python)
ML Frameworks	TensorFlow, Keras
Video Processing	OpenCV, Dlib
Database	MySQL / MongoDB
Hosting	Google Cloud / AWS

🚀 Key Features
Upload videos in formats like MP4, AVI, or MOV.

Receive a detection report with:

Confidence score

Visual highlights of manipulations

Downloadable PDF report

History of all past video analyses

Secure login and user session management

Scalable and optimized for near real-time detection

📈 Datasets Used
FaceForensics++

Celeb-DF

DFDC – Deepfake Detection Challenge

🌐 Live Demo
(Include link if deployed)
Try out the web app and upload your own video for deepfake analysis.

📄 Report & Documentation
Full project report is available in the repository (/docs/final_report.pdf) and includes:

Architecture diagrams

Dataset details

Performance metrics

Testing strategy

🔮 Future Enhancements
Real-time detection for video streams

Mobile application version

Integration with social media moderation tools

Advanced models like Vision Transformers (ViT)
