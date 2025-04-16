import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

Swiper.use([Navigation, Pagination]);

export default class Slider {
    constructor(selector, options = {}) {
        this.selector = selector;
        this.options = options;
        this.slider = null;

        this.init();
    }

    init() {
        this.slider = new Swiper(this.selector, this.options);
    }

    destroy() {
        if (this.slider) {
            this.slider.destroy(true, true);
            this.slider = null;
        }
    }
}
