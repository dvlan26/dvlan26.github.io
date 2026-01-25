// Language Switching Functionality
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'en';
        this.init();
    }

    init() {
        // Get language buttons
        this.enBtn = document.getElementById('en-btn');
        this.zhBtn = document.getElementById('zh-btn');

        // Add event listeners
        this.enBtn.addEventListener('click', () => this.switchLanguage('en'));
        this.zhBtn.addEventListener('click', () => this.switchLanguage('zh'));

        // Check for saved language preference
        this.loadLanguagePreference();
        
        // Initialize content to default language
        this.updateContent();
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;

        this.currentLang = lang;
        
        // Update button states
        this.updateButtonStates();
        
        // Update all translatable elements
        this.updateContent();
        
        // Save language preference
        this.saveLanguagePreference();
    }

    updateButtonStates() {
        this.enBtn.classList.toggle('active', this.currentLang === 'en');
        this.zhBtn.classList.toggle('active', this.currentLang === 'zh');
    }

    updateContent() {
        // Get all elements with data-en or data-zh attributes
        const translatableElements = document.querySelectorAll('[data-en],[data-zh]');
        
        translatableElements.forEach(element => {
            const enText = element.getAttribute('data-en');
            const zhText = element.getAttribute('data-zh');
            
            if (enText && zhText) {
                // 使用innerHTML而不是textContent，以便支持HTML标签（如换行符<br>）
                element.innerHTML = this.currentLang === 'en' ? enText : zhText;
            }
        });
    }

    saveLanguagePreference() {
        try {
            localStorage.setItem('preferredLanguage', this.currentLang);
        } catch (e) {
            // Ignore if localStorage is not available
            console.log('localStorage not available, cannot save language preference');
        }
    }

    loadLanguagePreference() {
        try {
            const savedLang = localStorage.getItem('preferredLanguage');
            if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
                this.switchLanguage(savedLang);
            } else {
                // If no preference is saved or invalid, ensure we use English
                this.currentLang = 'en';
                this.updateButtonStates();
                this.updateContent();
            }
        } catch (e) {
            // Ignore if localStorage is not available
            console.log('localStorage not available, using default language');
            this.currentLang = 'en';
            this.updateButtonStates();
            this.updateContent();
        }
    }
}

// Image Dragging Functionality
class ImageDraggable {
    constructor(imgElement) {
        this.img = imgElement;
        this.container = imgElement.parentElement;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.init();
    }

    init() {
        // Add event listeners
        this.img.addEventListener('mousedown', (e) => this.startDrag(e));
        this.img.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });

        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });

        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());

        // Add mouse leave event listener to container
        this.container.addEventListener('mouseleave', () => this.endDrag());

        // Add mouse enter and leave event listeners for hover effects
        this.container.addEventListener('mouseenter', () => this.hoverIn());
        this.container.addEventListener('mouseleave', () => this.hoverOut());
    }

    hoverIn() {
        if (!this.isDragging) {
            this.img.style.transition = 'transform 0.3s ease';
            this.img.style.transform = 'scale(3)';
        }
    }

    hoverOut() {
        if (!this.isDragging) {
            this.img.style.transition = 'transform 0.3s ease';
            this.img.style.transform = 'scale(1)';
        }
    }

    startDrag(e) {
        // Start dragging regardless of hover state
        this.isDragging = true;
        this.img.style.transition = 'none'; // Disable transition during dragging

        if (e.type === 'mousedown') {
            this.startX = e.clientX - this.currentX;
            this.startY = e.clientY - this.currentY;
        } else if (e.type === 'touchstart') {
            this.startX = e.touches[0].clientX - this.currentX;
            this.startY = e.touches[0].clientY - this.currentY;
        }
    }

    drag(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        let clientX, clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        this.currentX = clientX - this.startX;
        this.currentY = clientY - this.startY;

        // Calculate boundaries to prevent image from being dragged outside container
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        const scaledWidth = containerWidth * 3;
        const scaledHeight = containerHeight * 3;

        const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
        const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

        this.currentX = Math.max(-maxX, Math.min(maxX, this.currentX));
        this.currentY = Math.max(-maxY, Math.min(maxY, this.currentY));

        this.updatePosition();
    }

    endDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.img.style.transition = 'transform 0.3s ease'; // Re-enable transition
            // Reset to original position and size
            this.currentX = 0;
            this.currentY = 0;
            // Reset scale to 1
            this.img.style.transform = 'scale(1) translate(0, 0)';
        }
    }

    updatePosition() {
        this.img.style.transform = `scale(3) translate(${this.currentX}px, ${this.currentY}px)`;
    }
}

// Initialize image dragging functionality
function initImageDragging() {
    const researchImages = document.querySelectorAll('.card-image img');
    researchImages.forEach(img => {
        new ImageDraggable(img);
    });
}

// Timeline Card Expand/Collapse Functionality
class TimelineCardExpander {
    constructor() {
        this.init();
    }

    init() {
        const timelineCards = document.querySelectorAll('.timeline-card');
        timelineCards.forEach(card => {
            card.addEventListener('click', () => {
                this.toggleExpand(card);
            });
        });
    }

    toggleExpand(card) {
        // 如果卡片已经展开，则折叠它
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
        } else {
            // 先折叠所有其他卡片
            const allCards = document.querySelectorAll('.timeline-card');
            allCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('expanded');
                }
            });
            // 展开当前卡片
            card.classList.add('expanded');
        }
    }
}

// Initialize language switcher, image dragging, and timeline card expander when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LanguageSwitcher();
        initImageDragging();
        new TimelineCardExpander();
    });
} else {
    new LanguageSwitcher();
    initImageDragging();
    new TimelineCardExpander();
}
