import STORE from "store";
// import UTTERANCE from "../utterance";
import MAP_NAVIGATOR from "components/Navigation/MapNavigator";
import Worker from 'utils/my.worker.js';
import RENDERER from "renderer";

export default class RealtimeWebSocketEndpoint {
    constructor(serverAddr) {
        this.serverAddr = serverAddr;
        this.websocket = null;
        this.simWorldUpdatePeriodMs = 200;
        this.simWorldLastUpdateTimestamp = 0;
        this.mapUpdatePeriodMs = 1000;
        this.mapLastUpdateTimestamp = 0;
        this.updatePOI = true;
        this.routingTime = undefined;
        this.currentMode = null;
        // 创建子线程对象
        this.worker = new Worker();

        this.requestHmiStatus = this.requestHmiStatus.bind(this);
    }

    initialize() {
        try {
            this.websocket = new WebSocket(this.serverAddr);
            this.websocket.binaryType = "arraybuffer";
        } catch (error) {
            console.error("Failed to establish a connection: " + error);
            setTimeout(() => {
                this.initialize();
            }, 1000);
            return;
        }
        this.websocket.onmessage = event => {
            // console.log('websocket onmessage')
            // 主线程向子线程发送消息
            this.worker.postMessage({
                source: 'realtime',
                data: event.data,
            });
        };
        // 主线程接收子线程消息
        this.worker.onmessage = event => {
            // console.log('主线程')
            const message = event.data;
            // console.log(message)
            switch (message.type) {
                case "HMIStatus":
                    STORE.hmi.updateStatus(message.data);
                    // RENDERER.updateGroundImage(STORE.hmi.currentMap);
                    break;
                case "SimWorldUpdate":
                    // console.log('SimWorldUpdate')
                    this.checkMessage(message);

                    if (MAP_NAVIGATOR.isInitialized()) {
                        MAP_NAVIGATOR.update(message);
                    }
                    // 更新状态
                    console.log(message);
                    STORE.update(message);
                    // 判断是否初始化无人车偏移
                    RENDERER.maybeInitializeOffest(
                        message.autoDrivingCar.positionX,
                        message.autoDrivingCar.positionY);
                    RENDERER.updateWorld(message);
                    break;
                case "MapData":
                    // console.log("mapData");
                    RENDERER.updateMap(message.data);
                    STORE.setInitializationStatus(true);
                    break;
            }
        };
        this.worker.onerror = function (e) {
            console.log([
              'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
            ].join(''));
        };
        this.websocket.onclose = event => {
            console.log("WebSocket connection closed, close_code: " + event.code);

            // If connection has been lost for more than 10 sec, send the error message every 2 sec
            // const now = new Date().getTime();
            // const lossDuration = now - this.simWorldLastUpdateTimestamp;
            // const alertDuration = now - STORE.monitor.lastUpdateTimestamp;
            // if (this.simWorldLastUpdateTimestamp !== 0 &&
            //     lossDuration > 10000 && alertDuration > 2000) {
            //     const message = "Connection to the server has been lost.";
            //     STORE.monitor.insert("FATAL", message, now);
            //     if (UTTERANCE.getCurrentText() !== message || !UTTERANCE.isSpeaking() ) {
            //         UTTERANCE.speakOnce(message);
            //     }
            // }

            this.initialize();
        };
        
        setTimeout(() => {
            console.log(this.websocket.readyState, this.websocket.OPEN);
            if (this.websocket.readyState === this.websocket.OPEN) {
                console.log("requestHmiStatus");
                this.requestHmiStatus();
            }
        }, 1000);
        // Request simulation world every 100ms.
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (this.websocket.readyState === this.websocket.OPEN) {
                // this.requestSimulationWorld(STORE.options.showPNCMonitor);
                this.requestSimulationWorld();
                // this.requestHmiStatus();
            }
        }, this.simWorldUpdatePeriodMs);
    }

    checkMessage(world) {
        const now = new Date().getTime();
        const duration = now - this.simWorldLastUpdateTimestamp;
        if (this.simWorldLastUpdateTimestamp !== 0 && duration > 200) {
            console.warn("Last sim_world_update took " + duration + "ms");
        }
        // if (this.secondLastSeqNum === world.sequenceNum) {
        //     // Receiving multiple duplicated simulation_world messages
        //     // indicates a backend lag.
        //     console.warn("Received duplicate simulation_world:", this.lastSeqNum);
        // }
        // this.secondLastSeqNum = this.lastSeqNum;
        // this.lastSeqNum = world.sequenceNum;
        this.simWorldLastUpdateTimestamp = now;
    }

    requestSimulationWorld(requestPlanningData) {
        this.websocket.send(JSON.stringify({
            type : "RequestSimulationWorld"
            // planning : requestPlanningData,
        }));
    }

    // checkRoutingPoint(point) {
    //     const request = {
    //         type: "CheckRoutingPoint",
    //         point: point
    //     };
    //     this.websocket.send(JSON.stringify(request));
    // }

    // requestMapElementIdsByRadius(radius) {
    //     this.websocket.send(JSON.stringify({
    //         type: "RetrieveMapElementIdsByRadius",
    //         radius: radius,
    //     }));
    // }

    // requestRoute(start, start_heading, waypoint, end, parkingSpaceId) {
    //     const request = {
    //         type: "SendRoutingRequest",
    //         start: start,
    //         end: end,
    //         waypoint: waypoint,
    //     };

    //     if (parkingSpaceId) {
    //         request.parkingSpaceId = parkingSpaceId;
    //     }

    //     if (start_heading) {
    //         request.start.heading = start_heading;
    //     }
    //     this.websocket.send(JSON.stringify(request));
    // }

    // requestDefaultRoutingEndPoint() {
    //     this.websocket.send(JSON.stringify({
    //         type: "GetDefaultEndPoint",
    //     }));
    // }

    resetBackend() {
        this.websocket.send(JSON.stringify({
            type: "Reset",
        }));
    }

    dumpMessages() {
        this.websocket.send(JSON.stringify({
            type: "Dump",
        }));
    }

    // changeSetupMode(mode) {
    //     this.websocket.send(JSON.stringify({
    //         type: "HMIAction",
    //         action: "CHANGE_MODE",
    //         value: mode,
    //     }));
    // }

    // changeMap(map) {
    //     this.websocket.send(JSON.stringify({
    //         type: "HMIAction",
    //         action: "CHANGE_MAP",
    //         value: map,
    //     }));
    //     this.updatePOI = true;
    // }

    // changeVehicle(vehicle) {
    //     this.websocket.send(JSON.stringify({
    //         type: "HMIAction",
    //         action: "CHANGE_VEHICLE",
    //         value: vehicle,
    //     }));
    // }

    executeModeCommand(action) {
        if (!['SETUP_MODE', 'RESET_MODE', 'ENTER_AUTO_MODE'].includes(action)) {
            console.error("Unknown mode command found:", action);
            return;
        }

        this.websocket.send(JSON.stringify({
            type: "HMIAction",
            action: action,
        }));

        setTimeout(this.requestHmiStatus, 5000);
    }

    executeModuleCommand(moduleName, command) {
        if (!['START_MODULE', 'STOP_MODULE'].includes(command)) {
            console.error("Unknown module command found:", command);
            return;
        }

        this.websocket.send(JSON.stringify({
            type: "HMIAction",
            action: command,
            value: moduleName
        }));

        setTimeout(this.requestHmiStatus, 5000);
    }   

    // submitDriveEvent(eventTimeMs, eventMessage, eventTypes, isReportable) {
    // 	this.websocket.send(JSON.stringify({
    //         type: "SubmitDriveEvent",
    //         event_time_ms: eventTimeMs,
    //         event_msg: eventMessage,
    //         event_type: eventTypes,
    //         is_reportable: isReportable,
    //     }));
    // }

    toggleSimControl(enable) {
        this.websocket.send(JSON.stringify({
            type: "ToggleSimControl",
            enable: enable,
        }));
    }

    // requestRoutePath() {
    //     this.websocket.send(JSON.stringify({
    //         type: "RequestRoutePath",
    //     }));
    // }

    requestHmiStatus() {
        console.log("I am in requestHmiStatus fun");
        this.websocket.send(JSON.stringify({
            type: "HMIStatus"
        }));
    }

    // publishNavigationInfo(data) {
    //     this.websocket.send(data);
    // }

    // requestDataCollectionProgress() {
    //     this.websocket.send(JSON.stringify({
    //         type: "RequestDataCollectionProgress",
    //     }));
    // }
}
