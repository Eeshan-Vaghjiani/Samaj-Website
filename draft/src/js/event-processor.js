/**
 * Event Image Processor
 * This script handles image processing for events, including adding watermarks
 * and updating event information in the JSON file.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the event processor if we're on the event upload page
    if (document.getElementById('event-upload-form')) {
        initEventProcessor();
    }
});

/**
 * Initialize the event processing functionality
 */
function initEventProcessor() {
    const uploadForm = document.getElementById('event-upload-form');
    const imagePreview = document.getElementById('image-preview');
    const eventImageInput = document.getElementById('event-image');
    const processButton = document.getElementById('process-image');
    const statusMessage = document.getElementById('status-message');

    // Set up image preview
    if (eventImageInput) {
        eventImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" class="preview-img" alt="Event image preview">`;
                    // Show the process button once an image is selected
                    processButton.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Set up form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processEventData();
        });
    }

    // Set up process button
    if (processButton) {
        processButton.addEventListener('click', function() {
            addWatermark();
        });
    }
}

/**
 * Add watermark to the event image
 */
function addWatermark() {
    const imagePreview = document.getElementById('image-preview');
    const previewImg = imagePreview.querySelector('.preview-img');
    const statusMessage = document.getElementById('status-message');
    
    if (!previewImg) {
        showStatus('Please select an image first', 'error');
        return;
    }
    
    // Create a canvas to process the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create image elements for original and watermark
    const originalImg = new Image();
    const watermarkImg = new Image();
    
    // Set cross-origin to anonymous to avoid CORS issues
    originalImg.crossOrigin = 'anonymous';
    watermarkImg.crossOrigin = 'anonymous';
    
    // Load the original image
    originalImg.onload = function() {
        // Set canvas dimensions to match the original image
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;
        
        // Draw the original image on the canvas
        ctx.drawImage(originalImg, 0, 0);
        
        // Load the watermark (logo)
        watermarkImg.onload = function() {
            // Calculate logo size (fixed size, but preserve aspect ratio)
            const maxLogoWidth = 100; // Fixed width
            const maxLogoHeight = 100; // Fixed height
            const logoRatio = watermarkImg.width / watermarkImg.height;
            
            let logoWidth = maxLogoWidth;
            let logoHeight = logoWidth / logoRatio;
            
            if (logoHeight > maxLogoHeight) {
                logoHeight = maxLogoHeight;
                logoWidth = logoHeight * logoRatio;
            }
            
            // Position in top left with some padding
            const padding = 20;
            const x = padding;
            const y = padding;
            
            // Add semi-transparent white background for logo visibility
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(x, y, logoWidth, logoHeight);
            
            // Draw the logo on the canvas
            ctx.drawImage(watermarkImg, x, y, logoWidth, logoHeight);
            
            // Convert canvas to data URL
            const watermarkedImageUrl = canvas.toDataURL('image/jpeg');
            
            // Update preview with watermarked image
            imagePreview.innerHTML = `
                <div class="preview-container">
                    <img src="${watermarkedImageUrl}" class="watermarked-img" alt="Watermarked event image">
                    <p class="success-message">Watermark added successfully!</p>
                </div>
                <button id="save-watermarked" class="btn btn-success mt-3">Save Watermarked Image</button>
            `;
            
            // Add event listener to save button
            const saveButton = document.getElementById('save-watermarked');
            if (saveButton) {
                saveButton.addEventListener('click', function() {
                    saveWatermarkedImage(watermarkedImageUrl);
                });
            }
            
            showStatus('Watermark added successfully!', 'success');
        };
        
        // Set watermark source - path to logo
        watermarkImg.src = '../assets/images/Timeline Related Photos/samaj logo.png';
    };
    
    // Set source of original image
    originalImg.src = previewImg.src;
}

/**
 * Save the watermarked image
 * @param {string} imageUrl - The data URL of the watermarked image
 */
function saveWatermarkedImage(imageUrl) {
    const eventTitle = document.getElementById('event-title').value;
    const sanitizedTitle = eventTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const timestamp = new Date().getTime();
    const filename = `${sanitizedTitle}-${timestamp}.jpg`;
    
    // Create a link to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // In a real application, you would send this to the server
    // For demonstration, we'll just show a success message
    showStatus(`Image saved as ${filename}. In a production environment, this would be uploaded to the server.`, 'success');
    
    // Update the form with the filename
    document.getElementById('event-image-filename').value = filename;
}

/**
 * Process and save the complete event data
 */
function processEventData() {
    const form = document.getElementById('event-upload-form');
    const statusMessage = document.getElementById('status-message');
    const filename = document.getElementById('event-image-filename').value;
    
    if (!filename) {
        showStatus('Please process and save the image first', 'error');
        return;
    }
    
    // Collect form data
    const eventData = {
        id: Date.now(), // Use timestamp as a simple ID
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        description: document.getElementById('event-description').value,
        category: document.getElementById('event-category').value,
        image: filename,
        organizer: document.getElementById('event-organizer').value,
        contact: document.getElementById('event-contact').value,
        registrationRequired: document.getElementById('event-registration').checked,
        registrationDeadline: document.getElementById('event-deadline').value || null
    };
    
    // In a real application, you would send this data to the server
    // to update the JSON file. For demonstration, we'll display the data.
    console.log('Event data to be saved:', eventData);
    
    // Show success message
    showStatus('Event data processed successfully! In a production environment, this would be saved to the server.', 'success');
    
    // Reset form after 3 seconds
    setTimeout(() => {
        form.reset();
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('process-image').style.display = 'none';
    }, 3000);
}

/**
 * Display status message
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error)
 */
function showStatus(message, type) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
} 