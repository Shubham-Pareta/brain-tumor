document.addEventListener("DOMContentLoaded", function() {
    // File upload and preview for index.html
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const uploadForm = document.getElementById('uploadForm');
    
    if (dropzone && fileInput && preview) {
        // Handle drag and drop
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '#2c3e50';
            dropzone.style.backgroundColor = 'rgba(76, 161, 175, 0.2)';
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = '#4ca1af';
            dropzone.style.backgroundColor = 'rgba(76, 161, 175, 0.05)';
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '#4ca1af';
            dropzone.style.backgroundColor = 'rgba(76, 161, 175, 0.05)';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                displayPreview(e.dataTransfer.files[0]);
            }
        });
        
        // Handle click to browse
        dropzone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                displayPreview(fileInput.files[0]);
            }
        });
        
        // Display image preview
        function displayPreview(file) {
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    preview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                    preview.style.display = 'block';
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file (JPEG, PNG, etc.)');
            }
        }
        
        // Show loading state on form submission
        if (uploadForm) {
            uploadForm.addEventListener('submit', () => {
                if (!fileInput.files.length) {
                    alert('Please select an image first');
                    return false;
                }
                
                // Create and show loading spinner
                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'loading';
                loadingSpinner.innerHTML = '<div class="spinner"></div><p>Analyzing MRI scan...</p>';
                uploadForm.parentNode.insertBefore(loadingSpinner, uploadForm.nextSibling);
                
                // Disable form elements during submission
                const submitButton = uploadForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                }
            });
        }
    }
    
    // File upload and preview for predict.html
    const fileInputPredict = document.querySelector('#uploadForm #fileInput');
    const previewPredict = document.querySelector('#uploadForm #preview');
    
    if (fileInputPredict && previewPredict) {
        fileInputPredict.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewPredict.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    previewPredict.appendChild(img);
                    previewPredict.style.display = 'block';
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight tumor type cards
    function highlightCard(card) {
        card.style.transform = "scale(1.03)";
        card.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
    }
    
    function removeHighlight(card) {
        card.style.transform = "scale(1)";
        card.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.05)";
    }
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    if (navLinks.length && sections.length) {
        // Set initial active link
        setActiveLink();
        
        // Update on scroll
        window.addEventListener('scroll', function() {
            setActiveLink();
        });
        
        function setActiveLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
            
            // Handle home link separately
            const homeLink = document.querySelector('.home-link');
            if (homeLink) {
                if (window.scrollY < 100) {
                    homeLink.classList.add('active');
                } else {
                    homeLink.classList.remove('active');
                }
            }
        }
    }
});