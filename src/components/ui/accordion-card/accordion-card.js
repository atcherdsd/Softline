import { isMobile } from '../../../utils/helpers.js';

export default class AccordionCard {
    static events = {
        closeAllCards: 'accordion:closeAll'
    }

    constructor(cardElement) {
        this.buttonHeight = null;

        this.card = cardElement;
        this.button = this.card.querySelector('.accordion-card__button');
        this.content = this.card.querySelector('.accordion-card__content-inner');

        if (!this.button || !this.content) return;
        
        this.cardHeightWithoutContent = this.getCardHeightWithoutContent();

        this.card.addEventListener('click', this.onClick);
    }

    getCardHeightWithoutContent() {
        this.buttonHeight = this.button.offsetHeight;

        const computedStyle = window.getComputedStyle(this.button);
        const buttonPaddingBottom = parseInt(computedStyle.paddingBottom) || 0;

        return this.buttonHeight + buttonPaddingBottom / 2;
    }

    onClick = (e) => {
        if (!isMobile()) return;

        const isInnerInteractive = 
            e.target.closest('a, button, input, textarea') &&
            !e.target.closest('.accordion-card__button');
        if (isInnerInteractive) return;

        const isActive = this.card.classList.contains('active');

        if (isActive) {
            this.close();
        } else {
            this.emitCloseOthers();
            this.open();
        }
    }

    open() {
        const contentHeight = this.content.scrollHeight;
        const fullCardHeight = this.cardHeightWithoutContent + contentHeight;

        const finalCardHeight = fullCardHeight > 240 ? fullCardHeight : 240;

        this.card.classList.add('active');
        this.card.style.height = `${finalCardHeight}px`;
        this.content.style.maxHeight = `${contentHeight}px`;
    }

    close() {
        this.card.classList.remove('active');
        this.card.style.height = `${this.buttonHeight}px`;
        this.content.style.maxHeight = '0';
    }

    emitCloseOthers() {
        const event = new CustomEvent(AccordionCard.events.closeAllCards, {
            detail: { except: this.card },
            bubbles: true,
        });
        this.card.dispatchEvent(event);
    }
}
