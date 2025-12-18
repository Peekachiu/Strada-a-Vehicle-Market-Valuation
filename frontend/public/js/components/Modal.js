export class Modal {
    constructor() {
        this.modalOverlay = null;
        this.closeButton = null;
        this.handleEscape = this.handleEscape.bind(this);
    }

    /**
     * Creates the modal DOM structure.
     * @param {string} title - The title of the modal.
     * @param {string} content - The HTML content of the modal body.
     */
    create(title, content) {
        // Create overlay
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.className = 'modal-overlay';

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container animate-fade-up';

        // Create header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = title;

        this.closeButton = document.createElement('button');
        this.closeButton.className = 'modal-close-btn';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.ariaLabel = 'Close modal';
        this.closeButton.onclick = () => this.close();

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(this.closeButton);

        // Create body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.innerHTML = content;

        // Assemble
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
        this.modalOverlay.appendChild(modalContainer);

        // Check for click outside to close
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.close();
            }
        });

        document.body.appendChild(this.modalOverlay);
        document.addEventListener('keydown', this.handleEscape);

        // Prevent verify scroll lock
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (this.modalOverlay) {
            document.removeEventListener('keydown', this.handleEscape);
            this.modalOverlay.remove();
            this.modalOverlay = null;
            document.body.style.overflow = '';
        }
    }

    handleEscape(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}
