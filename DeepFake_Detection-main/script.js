// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const dropzone = document.getElementById('dropzone');
    const fileUpload = document.getElementById('file-upload');
    const videoUrlInput = document.getElementById('video-url');
    const detectBtn = document.getElementById('detect-btn');
    const loadingEl = document.getElementById('loading');
    const resultsEl = document.getElementById('results');
    const closeResults = document.getElementById('close-results');
    const confidenceBar = document.getElementById('confidence-bar');
    const resultStatus = document.getElementById('result-status');
    const contactForm = document.getElementById('contact-form');
    const sections = document.querySelectorAll('.section');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Sticky Navbar
    window.addEventListener('scroll', function() {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 50) {
        navbar.style.padding = '0.7rem 0';
        navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
      } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 10px 30px -10px rgba(2, 12, 27, 0.5)';
      }
      
      // Highlight active section in navbar
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
  
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Mobile Menu Toggle
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('show');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
      });
    });
    
    // Tabs Functionality
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        
        // Remove active class from all buttons and panes
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to current button and pane
        this.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Reset detect button and form
        updateDetectButton();
      });
    });
    
    // Dropzone functionality
    dropzone.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('drag-over');
    });
    
    dropzone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
    });
    
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length) {
        fileUpload.files = e.dataTransfer.files;
        handleFileSelection();
      }
    });
    
    dropzone.addEventListener('click', function() {
      fileUpload.click();
    });
    
    fileUpload.addEventListener('change', handleFileSelection);
    
    function handleFileSelection() {
      if (fileUpload.files.length) {
        const file = fileUpload.files[0];
        
        // Check if it's a video file
        if (file.type.indexOf('video/') === 0) {
          dropzone.innerHTML = `
            <i class="fas fa-file-video"></i>
            <p>${file.name}</p>
            <p class="small">${formatFileSize(file.size)}</p>
          `;
          updateDetectButton();
        } else {
          alert('Please select a video file.');
          fileUpload.value = '';
        }
      }
    }
    
    // URL Input validation
    videoUrlInput.addEventListener('input', updateDetectButton);
    
    function updateDetectButton() {
      const activeTab = document.querySelector('.tab-pane.active');
      
      if (activeTab.id === 'upload-tab') {
        detectBtn.disabled = !fileUpload.files.length;
      } else {
        const url = videoUrlInput.value.trim();
        const isValidUrl = url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.*$/i) ||
                           url.match(/\.(mp4|avi|mov|wmv)$/i);
        detectBtn.disabled = !isValidUrl;
      }
    }
    
    // Detection process
    detectBtn.addEventListener('click', function() {
      // Show loading
      loadingEl.classList.remove('hidden');
      detectBtn.disabled = true;
      resultsEl.classList.add('hidden');
      
      // Simulate detection (in a real app, this would be an API call)
      setTimeout(function() {
        loadingEl.classList.add('hidden');
        resultsEl.classList.remove('hidden');
        
        // Simulate random confidence between 80-95%
        const isFake = Math.random() > 0.3;
        const confidence = isFake ? 
          Math.floor(Math.random() * 15) + 80 : 
          Math.floor(Math.random() * 15) + 5;
        
        // Update result UI
        confidenceBar.style.width = `${confidence}%`;
        
        if (isFake) {
          resultStatus.className = 'fake';
          resultStatus.innerHTML = `
            <span class="result-label">LIKELY FAKE</span>
            <span class="confidence">${confidence}%</span>
          `;
        } else {
          resultStatus.className = 'real';
          resultStatus.innerHTML = `
            <span class="result-label">LIKELY AUTHENTIC</span>
            <span class="confidence">${confidence}%</span>
          `;
        }
      }, 2500);
    });
    
    // Close results
    closeResults.addEventListener('click', function() {
      resultsEl.classList.add('hidden');
      detectBtn.disabled = false;
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Simple validation
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill all fields');
        return;
      }
      
      // Simulate form submission
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
    
    // FAQ toggle functionality - FIXED
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        // Toggle active class on the clicked item
        item.classList.toggle('active');
        
        // Get the answer element
        const answer = item.querySelector('.faq-answer');
        
        // Toggle the max-height to show/hide the answer
        if (item.classList.contains('active')) {
          // Set explicit max-height when active
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          // Reset max-height when not active
          answer.style.maxHeight = '0';
        }
      });
    });
    
    // Initialize FAQ items (ensure answers are hidden on page load)
    faqItems.forEach(item => {
      const answer = item.querySelector('.faq-answer');
      answer.style.maxHeight = '0';
    });
    
    // Helper function to format file size
    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' bytes';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // Add fade-in animation to sections
    sections.forEach(section => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.classList.add('fade-in');
            observer.unobserve(section);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(section);
    });
  });