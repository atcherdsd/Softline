import AccordionCard from '../../ui/accordion-card/accordion-card.js';
import { debounce, isMobile } from '../../../utils/helpers.js';

export default class BusinessDirections {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.cards = [];

        if (!this.container) return;

        this.init();
        window.addEventListener('resize', debounce(this.onResize, 150));
    }

    init() {
        const cardElements = this.container.querySelectorAll('.accordion-card');
        this.cards = Array.from(cardElements).map((el) => new AccordionCard(el));

        this.container.addEventListener(AccordionCard.events.closeAllCards, this.handleCloseAll);
    }

    handleCloseAll = (e) => {
        const exceptCard = e.detail.except;

        this.cards.forEach((card) => {
            if (card.card !== exceptCard) card.close();
        });
    };

    onResize = () => {
        if (!isMobile()) {
            this.cards.forEach((card) => card.onDesktopResize());
        }
    };
}
