import Slider from '../../common/slider/slider.js';
import { isMobile, debounce } from '../../../utils/helpers.js';

export default class CorporateLife {
    constructor(container) {
        this.container = container;
        this.slider = null;
        this.observer = null;
        this.delay = isMobile() ? 150 : 50;
    }

    get sliderElement() {
        return this.container?.querySelector('.corporate-life__slider');
    }

    init() {
        if (!this.container) return;

        this.observe();

        window.addEventListener('scroll', this.checkVisibility);
    }

    observe() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            rootMargin: '0px 0px -20% 0px',
            threshold: 0.2,
        });
    
        this.observer.observe(this.container);
    }

    handleIntersect = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.handleVisible();
            }
        });
    }

    checkVisibility = debounce(() => {
        const rect = this.container.getBoundingClientRect();
        if (rect.top > window.innerHeight * 1.5) {
            return;
        }
        if (rect.top < window.innerHeight && !this.container.classList.contains('corporate-life--visible')) {
            this.handleVisible();
        }
    }, this.delay);

    handleVisible = () => {
        this.initSlider();
        this.container.classList.add('corporate-life--visible');
        this.observer?.disconnect();
        window.removeEventListener('scroll', this.checkVisibility);
    }

    initSlider() {
        const sliderEl = this.sliderElement;
        if (!sliderEl) return;
    
        this.slider = new Slider(sliderEl, {
            slidesPerView: 1,
            navigation: {
                nextEl: this.container.querySelector('.corporate-life__button--next'),
                prevEl: this.container.querySelector('.corporate-life__button--prev'),
            },
            pagination: {
                el: this.container.querySelector('.corporate-life__pagination'),
                clickable: true,
                renderBullet: function (_, className) {
                    return `
                        <span class="${className}"></span>
                    `
                },
            },
        });
    }
}
