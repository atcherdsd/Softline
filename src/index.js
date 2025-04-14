import './styles/main.scss';
import CorporateLife from './components/sections/corporate-life/corporate-life.js';

const section = document.querySelector('.corporate-life');

if (section) {
    const sliderComponent = new CorporateLife(section);
    sliderComponent.init();
}
