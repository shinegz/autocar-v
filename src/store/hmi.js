/**
 * 负责管理人机交互接口的相关数据
 */
import { observable, action, computed, extendObservable } from "mobx";

import WS from "store/websocket";

export default class HMI {
    modes = [];
    @observable currentMode = 'none';

    @observable moduleStatus = observable.map();
    @observable componentStatus = observable.map();
    @observable enableStartAuto = false;

    utmZoneId = "";

    @computed get inNavigationMode() {
        return this.currentMode === "Navigation";
    }

    @action toggleModule(id) {
        this.moduleStatus.set(id, !this.moduleStatus.get(id));
        const command = this.moduleStatus.get(id) ? "START_MODULE" : "STOP_MODULE";
        WS.executeModuleCommand(id, command);
    }

    @action updateStatus(newStatus) {
        // if (newStatus.dockerImage) {
        //     this.dockerImage = newStatus.dockerImage;
        // }
        // if (newStatus.utmZoneId) {
        //     this.utmZoneId = newStatus.utmZoneId;
        // }

        // if (newStatus.modes) {
        //     this.modes = newStatus.modes.sort();
        // }
        // if (newStatus.currentMode) {
        //     this.isCalibrationMode = (newStatus.currentMode.toLowerCase().includes('calibration'));
        //     if (this.currentMode !== newStatus.currentMode) {
        //         this.resetDataCollectionProgress();
        //     }
        //     this.currentMode = newStatus.currentMode;
        // }

        // if (newStatus.maps) {
        //     this.maps = newStatus.maps.sort();
        // }
        // if (newStatus.currentMap) {
        //     this.currentMap = newStatus.currentMap;
        // }

        // if (newStatus.vehicles) {
        //     this.vehicles = newStatus.vehicles.sort();
        // }
        // if (newStatus.currentVehicle) {
        //     if (this.isCalibrationMode && this.currentVehicle !== newStatus.currentVehicle) {
        //         this.resetDataCollectionProgress();
        //     }
        //     this.currentVehicle = newStatus.currentVehicle;
        // }
        
        if (newStatus.modules) {
            const newKeyList = JSON.stringify(Object.keys(newStatus.modules).sort());
            // console.log(Object.prototype.toString.call(this.moduleStatus.keys()))
            // console.log([...this.moduleStatus.keys()])
            const curKeyList = JSON.stringify([...this.moduleStatus.keys()].sort());
            if (newKeyList !== curKeyList) {
                this.moduleStatus.clear();
            }
            for (const key in newStatus.modules) {
                this.moduleStatus.set(key, newStatus.modules[key]);
            }
        }

        if (newStatus.monitoredComponents) {
            const newKeyList = JSON.stringify(Object.keys(newStatus.monitoredComponents).sort());
            const curKeyList = JSON.stringify([...this.componentStatus.keys()].sort());
            if (newKeyList !== curKeyList) {
                this.componentStatus.clear();
            }
            for (const key in newStatus.monitoredComponents) {
                this.componentStatus.set(key, newStatus.monitoredComponents[key]);
            }
        }

        // if (typeof newStatus.passengerMsg === "string") {
        //     UTTERANCE.speakRepeatedly(newStatus.passengerMsg);
        // }
    }

    @action update(world) {
        this.enableStartAuto = world.engageAdvice === "READY_TO_ENGAGE";
    }

}
