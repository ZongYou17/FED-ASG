document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlight
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Highlight active nav item
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'vendor-feedback.html') {
            link.style.background = '#0066cc';
            link.style.color = 'white';
            link.style.borderColor = '#0066cc';
        }
        
        link.addEventListener('click', function() {
            // Reset all nav links
            navLinks.forEach(l => {
                l.style.background = '#f0f0f0';
                l.style.color = '#333';
                l.style.borderColor = '#ccc';
            });
            
            // Highlight clicked link
            this.style.background = '#0066cc';
            this.style.color = 'white';
            this.style.borderColor = '#0066cc';
        });
    });
    
    // DOM Elements
    const modal = document.getElementById('replyModal');
    const successMessage = document.getElementById('successMessage');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelReply');
    const submitBtn = document.getElementById('submitReply');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    
    // Open modal for replying
    function openReplyModal(feedbackBox) {
        const feedbackContent = feedbackBox.querySelector('.feedback-content');
        const feedbackType = feedbackBox.querySelector('.feedback-title').textContent;
        const author = feedbackBox.querySelector('.feedback-author').textContent.replace('By: ', '').trim();
        
        // Set modal content
        document.getElementById('modalTitle').textContent = `Reply to ${feedbackType}`;
        document.getElementById('feedbackText').textContent = feedbackContent.textContent;
        document.getElementById('feedbackAuthor').textContent = `By: ${author}`;
        
        // Clear text area
        document.getElementById('replyText').value = '';
        
        // Show modal
        modal.classList.add('show');
        document.getElementById('replyText').focus();
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('show');
    }
    
    // Submit reply
    function submitReply() {
        const replyMessage = document.getElementById('replyText').value.trim();
        
        if (!replyMessage) {
            alert('Please enter a reply message.');
            return;
        }
        
        // Close modal and show success message
        closeModal();
        successMessage.classList.add('show');
    }
    
    // Close success message
    function closeSuccess() {
        successMessage.classList.remove('show');
    }
    
    // Event Listeners
    const replyButtons = document.querySelectorAll('.reply-button');
    
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const feedbackBox = this.closest('.feedback-box');
            const feedbackContent = feedbackBox.querySelector('.feedback-content');
            
            // Check if reply content is empty
            if (feedbackContent.classList.contains('empty-content')) {
                alert('Cannot reply to empty feedback.');
                return;
            }
            
            openReplyModal(feedbackBox);
        });
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    submitBtn.addEventListener('click', submitReply);
    closeSuccessBtn.addEventListener('click', closeSuccess);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close success when clicking outside
    successMessage.addEventListener('click', function(e) {
        if (e.target === successMessage) {
            closeSuccess();
        }
    });
});