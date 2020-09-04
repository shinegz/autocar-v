import { observable, computed, action } from 'mobx';

import Options from './options';
import HMI from './hmi';

class DreamviewStore {

    @observable isInitialized = false;

    @observable options = new Options();

    @observable hmi = new HMI();

    handleOptionToggle(option) {
        // const oldShowMonitor = this.options.showMonitor;
        // const oldShowTools = this.options.showTools;
        // const oldShowRouteEditingBar = this.options.showRouteEditingBar;

        this.options.toggle(option);

        // disable tools after toggling
        // if (oldShowMonitor && !this.options.showMonitor) {
        //     this.dimension.disableMonitor();
        // }
        // if (oldShowRouteEditingBar && !this.options.showRouteEditingBar) {
        //     this.routeEditingManager.disableRouteEditing();
        // }

        // // enable selected tool
        // if (!oldShowMonitor && this.options.showMonitor) {
        //     this.dimension.enableMonitor();
        // } else if (oldShowTools !== this.options.showTools) {
        //     this.dimension.update();
        // }
        // if (option === "showRouteEditingBar") {
        //     this.options.showPOI = false;
        //     this.routeEditingManager.enableRouteEditing();
        // }
    }

    setOptionStatus(option, enabled) {
        const oldStatus = this.options[option];
        const newStatus = (enabled || false);
        if (oldStatus !== newStatus) {
            this.handleOptionToggle(option);
        }
    }

    @computed get enableHMIButtonsOnly() {
        return !this.isInitialized;
    }

}

const STORE = new DreamviewStore();

export default STORE;
