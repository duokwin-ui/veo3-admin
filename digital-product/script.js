/**
 * AI Content Automation Starter Kit - Landing Page
 * Simple interactions for better UX
 */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 20;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Button click tracking (for analytics if needed)
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Add click feedback
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Intersection Observer for animations (optional, lightweight)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for fade-in effect (only if browser supports)
if ('IntersectionObserver' in window) {
    document.querySelectorAll('.pain-card, .benefit-card, .include-item, .who-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// SePay integration placeholder
// Replace this with actual SePay widget code
const sepayButton = document.getElementById('sepay-button');
if (sepayButton) {
    sepayButton.addEventListener('click', function(e) {
        // Example: Open SePay QR modal or redirect
        // Replace with actual SePay integration
        console.log('SePay payment triggered');
        
        // Uncomment and modify below for actual SePay integration:
        // window.open('YOUR_SEPay_URL_HERE', '_blank');
    });
}

// Lazy load any external resources
document.addEventListener('DOMContentLoaded', function() {
    // Preconnect to Google Fonts for faster loading
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
    
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    document.head.appendChild(preconnect2);
});
