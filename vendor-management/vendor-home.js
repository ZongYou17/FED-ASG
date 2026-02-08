document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlight
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Highlight active nav item
            navLinks.forEach(l => {
                l.style.background = '#f0f0f0';
                l.style.color = '#333';
                l.style.borderColor = '#ccc';
            });
            
            // Active state for clicked link
            this.style.background = '#0066cc';
            this.style.color = 'white';
            this.style.borderColor = '#0066cc';
            
            console.log(`Navigating to: ${this.textContent} (${this.href})`);
        });
    });
    
    // Set active state for current page
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.style.background = '#0066cc';
            link.style.color = 'white';
            link.style.borderColor = '#0066cc';
        }
    });
});