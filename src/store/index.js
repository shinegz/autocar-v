import { observable, computed, action } from 'mobx';

import Options from 'store/options';
import HMI from 'store/hmi';
import Dimension from 'store/dimension';
import ControlData from "store/control_data";

class DreamviewStore {

    @observable isInitialized = false;

    @observable options = new Options();

    @observable hmi = new HMI();

    @observable controlData = new ControlData();

    @observable geolocation = {};

    @observable moduleDelay = observable.map();

    @observable dimension = new Dimension(this.hmi, this.options);

    handleOptionToggle(option) {
        const oldShowMonitor = this.options.showMonitor;
        const oldShowTools = this.options.showTools;
        // const oldShowRouteEditingBar = this.options.showRouteEditingBar;

        this.options.toggle(option);

        // disable tools after toggling
        if (oldShowMonitor && !this.options.showMonitor) {
            this.dimension.disableMonitor();
        }
        // if (oldShowRouteEditingBar && !this.options.showRouteEditingBar) {
        //     this.routeEditingManager.disableRouteEditing();
        // }

        // // enable selected tool
        if (!oldShowMonitor && this.options.showMonitor) {
            this.dimension.enableMonitor();
        } else if (oldShowTools !== this.options.showTools) {
            this.dimension.update();
        }
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

    // 判断是否初始化完成，若未完成，则只使能HMI Button
    @computed get enableHMIButtonsOnly() {
        return !this.isInitialized;
    }

    // 设置初始化状态标志位
    @action setInitializationStatus(status) {
        this.isInitialized = status;
    }

    @action setGeolocation(newGeolocation) {
        this.geolocation = newGeolocation;
    }

    @action updateModuleDelay(world) {
        if (world && world.delay) {
            for (module in world.delay) {
                const hasNotUpdated = (world.delay[module] < 0);
                const delay = hasNotUpdated ? '-' : world.delay[module].toFixed(2);
                if (this.moduleDelay.has(module)) {
                    this.moduleDelay.get(module).delay = delay;
                } else {
                    this.moduleDelay.set(module, {
                        delay: delay,
                        name: module[0].toUpperCase() + module.slice(1),
                    });
                }
            }
        }
    }

    update(world, isNewMode) {
        // if (isNewMode) {
        //     this.options.resetOptions();
        //     this.dimension.disableMonitor();
        //     this.routeEditingManager.disableRouteEditing();
        // }

        // this.updateTimestamp(world.timestamp);
        this.updateModuleDelay(world);

        // const wasAutoMode = this.meters.isAutoMode;
        // this.meters.update(world);
        // this.handleDrivingModeChange(wasAutoMode, this.meters.isAutoMode);

        // this.monitor.update(world);
        // this.trafficSignal.update(world);
        // this.hmi.update(world);
        console.log("update")
        
        // this.updateCustomizedToggles(world);
        if (this.options.showPNCMonitor) {
            // this.storyTellers.update(world);
            // this.planningData.update(world);
            
            this.controlData.update(world, this.hmi.vehicleParam);
            // this.latency.update(world);
        }

        // if (this.hmi.inCarTeleopMode) {
        //     this.setOptionStatus('showCarTeleopMonitor', true);
        // } else if (this.hmi.inConsoleTeleopMode) {
        //     this.setOptionStatus('showConsoleTeleopMonitor', true);
        // }
    }

}

const STORE = new DreamviewStore();

export default STORE;
