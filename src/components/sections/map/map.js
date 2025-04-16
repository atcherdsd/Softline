import { isMobile } from '../../../utils/helpers.js';

export default class MapComponent {
    constructor(svgRoot, citiesData, controlsContainer) {
        this.svgRoot = svgRoot;
        this.citiesData = citiesData;
        this.controlsContainer = controlsContainer;
        this.isInitial = true;
        this.isOpenedPanel = false;
        this.activeRegionButton = null;

        this.circleFirstKeys = Object.keys(this.citiesData.circleFirst);
        this.labelFirstKeys = Object.keys(this.citiesData.labelFirst);

        this.toggleButton = this.controlsContainer.querySelector('.map__toggle-button');
        this.toggleButton?.addEventListener('click', this.toggleControlPanel);

        this.tabsContainer = this.controlsContainer.querySelector('.map__tabs');

        this.tabs = this.controlsContainer.querySelectorAll('.map__tab');
        this.controlPanel = this.controlsContainer.querySelector('.map__cities-panel');
        this.controlPanelRegionButtons = this.controlPanel.querySelectorAll('.map__cities-region');
    }

    init() {
        this.setCityDataAttributes();
        this.setupFilterControls();
    }

    setCityDataAttributes() {
        if (!this.circleFirstKeys || !this.labelFirstKeys || !this.citiesData) return;

        const mainGroup = isMobile() ? 
            document.getElementById('city-labels-mobile') : 
            document.getElementById('city-labels');
        if (mainGroup) {
            this._setAttributesToCityPairs(
                mainGroup.children, 
                false, 
                this.circleFirstKeys, 
                this.citiesData.circleFirst
            );
        }

        const reversedGroup = isMobile() ? 
            document.getElementById('labels-city-mobile') : 
            document.getElementById('labels-city');
        if (reversedGroup) {
            this._setAttributesToCityPairs(
                reversedGroup.children, 
                true, 
                this.labelFirstKeys, 
                this.citiesData.labelFirst
            );
        }
	}

    _setAttributesToCityPairs = (elements, isReversed, cityKeys, citiesData) => {
        const pairs = Array.from(elements);
        let cityIndex = 0;

        for (let i = 0; i < pairs.length; i += 2) {
            const first = pairs[i];
            const second = pairs[i + 1];

            if (!first || !second) continue;

            const cityKey = cityKeys[cityIndex++];
            if (!cityKey) break;

            const cityData = citiesData[cityKey];

            const [label, circle] = isReversed ? [first, second] : [second, first];

            if (circle.tagName.toLowerCase() === 'circle') {
                circle.setAttribute('data-city', cityKey);
                circle.setAttribute('data-region', cityData.region);
            }

            if (label.tagName.toLowerCase() === 'path') {
                label.setAttribute('data-city-label', cityKey);
            }
        }
    };

    setupFilterControls() {
        if (!this.controlsContainer) return;

        const buttons = this.controlsContainer.querySelectorAll('[data-filter]');
        if (!buttons.length) return;

        if (this.isInitial) {
            const btnAll = Array.from(buttons).find((btn) => btn.dataset.filter === 'all');

            if (btnAll) {
                this.applyFilter('all');
                this.highlightActiveButton(btnAll, buttons);

                this.isInitial = false;
            }
        }

        this.filterButtonHandlers = new Map();

        buttons.forEach((btn) => {
            const handler = () => this.onFilterButtonClick(btn, buttons);
            this.filterButtonHandlers.set(btn, handler);
            btn.addEventListener('click', handler);
        });
    }

    onFilterButtonClick(btn, buttons) {
        const filterValue = btn.dataset.filter;
        const citiesPanelButtons = 
            Array.from(this.controlPanelRegionButtons)
                .filter((button) => button.dataset.filterType === 'city');

        if (
            !isMobile() || 
            (isMobile() && citiesPanelButtons.includes(btn)) ||
            !Array.from(this.controlPanelRegionButtons).includes(btn)
        ) {
            this.applyFilter(filterValue);
            this.highlightActiveButton(btn, buttons);

            this.syncButtonsState(btn);

            if (btn.closest('.map__cities-panel')) {
                this.hideControlPanel();
            }
        } else {
            this.handleRegionControlsOnMobile(btn);
        }
    }

    handleRegionControlsOnMobile(btn) {
        this.closeAllRegionButtons();

        const citiesButtonsList = btn.closest('.map__cities-group')?.querySelector('.map__cities-list');

        if (!this.activeRegionButton || this.activeRegionButton !== btn) {
            btn.classList.add('active');

            const btnIcon = btn.querySelector('img');
            btnIcon?.classList.add('opened');

            citiesButtonsList.classList.add('opened');

            this.activeRegionButton = btn;
        } else {
            this.closeCurrentCitiesButtonsList(btn, citiesButtonsList);
        }
    }

    closeAllRegionButtons() {
        const panelRegionButtons = Array.from(this.controlPanelRegionButtons)
            .filter((btn) => btn.dataset.filterType === 'region');
        
        if (!panelRegionButtons.length) return;

        panelRegionButtons.forEach((btn) => {
            btn.classList.remove('active');
            btn.querySelector('img')?.classList.remove('opened');

            const citiesButtonsList = btn.closest('.map__cities-group')?.querySelector('.map__cities-list');
            citiesButtonsList.classList.remove('opened');
        });
    }

    closeCurrentCitiesButtonsList(btn, citiesButtonsList) {
        btn.classList.remove('active');
        btn.querySelector('img')?.classList.remove('opened');
        citiesButtonsList.classList.remove('opened');

        this.activeRegionButton = null;
    }

    applyFilter(filterValue) {
        const allCircles = this.svgRoot.querySelectorAll('circle[data-city]');
        const allLabels = this.svgRoot.querySelectorAll('path[data-city-label]');

        allCircles.forEach(el => el.classList.remove('visible'));
        allLabels.forEach(el => el.classList.remove('visible'));

        allCircles.forEach(el => {
            const region = el.dataset.region;
            const city = el.dataset.city;

            if (
                filterValue === 'all' ||
                region === filterValue ||
                city === filterValue
            ) {
                el.classList.add('visible');
            }
        });

        allLabels.forEach(el => {
            const city = el.dataset.cityLabel;
            if (
                filterValue === 'all' ||
                this.citiesData.circleFirst[city]?.region === filterValue ||
                this.citiesData.labelFirst[city]?.region === filterValue ||
                city === filterValue
            ) {
                el.classList.add('visible');
            }
        });
    }

    highlightActiveButton(activeBtn, allButtons) {
        allButtons.forEach((btn) => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    hideControlPanel() {
        if (this.controlPanel) {
            this.controlPanel.classList.add('hidden');
            this.isOpenedPanel = false;

            this.toggleButtonIcon();

            this.closeAllRegionButtons();
            this.activeRegionButton = null;
            isMobile() ? this.toggleTabsContainer() : this.toggleTabs();
        }
    }

    toggleControlPanel = () => {
        if (this.controlPanel) {
            this.controlPanel.classList[this.isOpenedPanel ? 'add' : 'remove']('hidden');
            this.isOpenedPanel = !this.isOpenedPanel;
            
            this.toggleButtonIcon();

            if (!this.isOpenedPanel) {
                this.closeAllRegionButtons();
                this.activeRegionButton = null;
            }
            
            isMobile() ? this.toggleTabsContainer() : this.toggleTabs();
        }
    }

    toggleTabsContainer() {
        this.tabsContainer?.classList[this.isOpenedPanel ? 'add' : 'remove']('hidden');
    }

    toggleTabs() {
        if (this.tabs.length) {
            this.tabs.forEach((tab) => {
                this.isOpenedPanel ?
                    tab.setAttribute('disabled', true) :
                    tab.removeAttribute('disabled');
            })
        }
    }

    toggleButtonIcon() {
        const toggleButtonIcon = this.toggleButton.querySelector('.map__toggle-button-icon');
        toggleButtonIcon?.classList[this.isOpenedPanel ? 'add' : 'remove']('opened');
    }

    syncButtonsState(btn) {
        const regionTabs = Array.from(this.tabs).filter((tab) => tab.dataset.filter !== 'all');
        const controlRegionButtons = Array.from(this.controlPanelRegionButtons);

        if (regionTabs.includes(btn)) {
            const currentBtnOnPanel = controlRegionButtons
                .find((button) => button.dataset.filter === btn.dataset.filter);
            currentBtnOnPanel?.classList.add('active');
        }
        
        if (controlRegionButtons.includes(btn)) {
            const currentTab = regionTabs
                .find((tab) => tab.dataset.filter === btn.dataset.filter);
            currentTab?.classList.add('active');
        }
    }

    destroy() {
        this.toggleButton?.removeEventListener('click', this.toggleControlPanel);

        this.filterButtonHandlers.forEach((handler, btn) => {
            btn.removeEventListener('click', handler);
        });
        this.filterButtonHandlers.clear();
    }
}
