import { observable, computed, action } from 'mobx';

import Options from 'store/options';
import HMI from 'store/hmi';
import Dimension from 'store/dimension';
import ControlData from "store/control_data";
import Meters from "store/meters";
import Monitor from "store/monitor";
import TrafficSignal from "store/traffic_signal";

class DreamviewStore {
    @observable timestamp = 0;

    @observable isInitialized = false;

    @observable options = new Options();

    @observable hmi = new HMI();

    @observable controlData = new ControlData();

    @observable trafficSignal = new TrafficSignal();

    @observable meters = new Meters();

    @observable monitor = new Monitor();

    @observable geolocation = {};

    @observable moduleDelay = observable.map();

    @observable dimension = new Dimension(this.hmi, this.options);

    @action updateTimestamp(newTimestamp) {
        this.timestamp = newTimestamp;
    }

    handleOptionToggle(option) {
        const oldShowMonitor = this.options.showMonitor;
        // 工具栏显示标志位
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

    update(world) {

        this.updateTimestamp(world.timestamp);
        this.updateModuleDelay(world);

        // const wasAutoMode = this.meters.isAutoMode;
        this.meters.update(world);

        // this.monitor.update(world);
        // this.trafficSignal.update(world);
        this.hmi.update(world);
        // console.log("update")
        
        // this.updateCustomizedToggles(world);
        if (this.options.showPNCMonitor) {
            // this.storyTellers.update(world);
            // this.planningData.update(world);
            
            this.controlData.update(world);
            // this.latency.update(world);
        }

    }

}

const STORE = new DreamviewStore();

export default STORE;
