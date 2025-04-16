import './styles/main.scss';
import { checkWebp, isMobile, debounce } from './utils/helpers.js';
import BusinessDirections from './components/sections/business-directions/business-directions.js';
import MapComponent from './components/sections/map/map.js';
import citiesData from './assets/data/citiesData.js';

checkWebp();

let map;

const getDeviceType = () => isMobile() ? 'mobile' : 'desktop';
let currentDeviceType = getDeviceType();

async function loadMapSVG(deviceType) {
    const svgPath = deviceType === 'mobile' 
        ? './assets/svg/map-mobile.svg' 
        : './assets/svg/map-desktop.svg';
  
    const containerSelector = deviceType === 'mobile' 
        ? '.map__map-container-mobile' 
        : '.map__map-container';
  
    const container = document.querySelector(containerSelector);
    if (!container) return null;
  
    const response = await fetch(svgPath);
    const svgText = await response.text();
    container.innerHTML = svgText;
  
    return container.querySelector('svg');
}

async function initMap() {
    const filterControls = document.querySelector('.map__tabs-container');
    if (!filterControls) return;
  
    const svgRoot = await loadMapSVG(currentDeviceType);
    if (!svgRoot) return;
  
    map = new MapComponent(svgRoot, citiesData, filterControls);
    map.init();
}


const onResize = async () => {
    const newDeviceType = getDeviceType();

    if (newDeviceType !== currentDeviceType) {
        currentDeviceType = newDeviceType;

        if (map && typeof map.destroy === 'function') {
            map.destroy();
        }
        map = null;
        await initMap();
    }
};

window.addEventListener('resize', debounce(onResize, 300));


(async function initApp() {
    await initMap();
  
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
})();
