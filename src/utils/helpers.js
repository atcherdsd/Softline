import { BREAKPOINTS } from "./variables.js";

export const isMobile = () => window.innerWidth <= BREAKPOINTS.MD;

export function debounce(fn, delay = 250) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

export const checkWebp = () => {
    if (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0) {
        document.documentElement.classList.add('webp');
    } else {
        document.documentElement.classList.add('no-webp');
    }
}
