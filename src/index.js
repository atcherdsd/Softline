import './styles/main.scss';
import { checkWebp } from './utils/helpers.js';
import BusinessDirections from './components/sections/business-directions/business-directions.js';

checkWebp();

new BusinessDirections('.business-directions__cards');

const section = document.querySelector('.corporate-life');

if (section) {
    const observer = new IntersectionObserver((entries, observer) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
            import('./components/sections/corporate-life/corporate-life.js').then((module) => {
                const CorporateLife = module.default;
                const sliderComponent = new CorporateLife(section);
                sliderComponent.init();
        });

        observer.unobserve(section);
        }
    }, {
        rootMargin: '0px 0px 200px 0px',
    });

    observer.observe(section);
}
