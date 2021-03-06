/**
 * 主控制模块产生的相关数据，基于车道规划和车辆当前状态，输出转向、加速和制动控制信号
 */
import { action, observable } from 'mobx';
import { LinearInterpolant, EllipseCurve } from 'three';

const MAX_HISTORY_POINTS = 80;

export default class ControlData {
    @observable lastUpdatedTime = null;

    // 绘制图表所用的数据，添加@observable会出错，原因是observable array的
    // 内部结构不能被更改
    data = this.initData();

    @action updateTime(newTime) {
        this.lastUpdatedTime = newTime;
    }

    initData() {
        return {
            // 轨迹
            trajectoryGraph: {
                plan: [],
                target: [],
                real: [],
                autoModeZone: [],
                steerCurve: [],
                currentTargetPoint: [],
            },
            pose: { x: null, y: null, heading: null },
            speedGraph: {
                plan: [],
                target: [],
                real: [],
                autoModeZone: []
            },
            // 曲率
            curvatureGraph: {
                plan: [],
                target: [],
                real: [],
                autoModeZone: []
            },
            accelerationGraph: {
                plan: [],
                target: [],
                real: [],
                autoModeZone: []
            },
            stationErrorGraph: {
                error: [],
            },
            headingErrorGraph: {
                error: [],
            },
            lateralErrorGraph: {
                error: [],
            },
        };
    }

    updateErrorGraph(graph, currentTimestamp, error) {
        if (!error || !currentTimestamp || !graph) {
            return;
        }

        // clean up data if needed
        const removeAllPoints = graph.error.length > 0 &&
            currentTimestamp < graph.error[graph.error.length - 1].x;
        const removeOldestPoint = (graph.error.length >= MAX_HISTORY_POINTS);
        if (removeAllPoints) {
            graph.error = [];
        } else if (removeOldestPoint) {
            graph.error.shift();
        }

        // add new data
        const hasNewData = graph.error.length === 0 ||
            currentTimestamp !== graph.error[graph.error.length - 1].x;
        if (hasNewData) {
            graph.error.push({ x: currentTimestamp, y: error });
        }
    }

    updateSteerCurve(graph, adc, vehicleParam) {
        const steeringAngle = adc.steeringAngle / vehicleParam.steerRatio;
        let R = null;
        if (Math.abs(Math.tan(steeringAngle)) > 0.0001) {
            R = vehicleParam.wheelBase / Math.tan(steeringAngle);
        } else {
            R = 100000;
        }

        const heading = adc.heading;
        const radius = Math.abs(R);
        const lengthAngle = 7200 / (2 * Math.PI * radius) * Math.PI / 180;
        let theta1 = null;
        let theta2 = null;
        let centerangle = null;
        let startangle = null;
        if (R >= 0) {
            centerangle = Math.PI / 2 + heading;
            startangle = (heading - Math.PI / 2);
            theta1 = 0;
            theta2 = lengthAngle;
        } else {
            centerangle = heading - Math.PI / 2;
            startangle = (Math.PI / 2 + heading);
            theta1 = -lengthAngle;
            theta2 = 0;
        }

        const centerx = adc.positionX + Math.cos(centerangle) * radius;
        const centery = adc.positionY + Math.sin(centerangle) * radius;

        const aClockwise = false;
        const curve = new EllipseCurve( // all in radians
            centerx, centery,
            radius, radius,
            theta1, theta2,
            aClockwise,
            startangle
        );

        graph.steerCurve = curve.getPoints(25);
    }

    // 根据当前时间计算插值
    interpolateValueByCurrentTime(trajectory, currentTime, fieldName) {
        if (fieldName === 'timestampSec') {
            return currentTime;
        } else {
            const absoluteTimes = trajectory.map((point) => {
                return point.timestampSec;
            });
            const plannedValues = trajectory.map((point) => {
                return point[fieldName];
            });
            // 得到线性插值实例
            const interpolant =
                new LinearInterpolant(absoluteTimes, plannedValues, 1, []);
            // 得到插值
            return interpolant.evaluate(currentTime)[0];
        }
    }

    // 更新无人车状态图表数据
    updateAdcStatusGraph(graph, trajectory, adc, xFieldName, yFieldName) {
        const currentTimestamp = adc.timestampSec;

        console.log("更新图表状态", graph);

        // clean up data if needed
        const removeAllPoints = graph.target.length > 0 &&
            currentTimestamp < graph.target[graph.target.length - 1].t;
        const removeOldestPoint = (graph.target.length >= MAX_HISTORY_POINTS);
        if (removeAllPoints) {
            graph.target = [];
            graph.real = [];
            graph.autoModeZone = [];
        } else if (removeOldestPoint) {
            graph.target.shift();
            graph.real.shift();
            graph.autoModeZone.shift();
        }

        // 判断是否需要更新数据
        const hasNewData = graph.target.length === 0 ||
            currentTimestamp !== graph.target[graph.target.length - 1].t;
        if (hasNewData) {
            // set planned data
            graph.plan = trajectory.map((point) => {
                return { x: point[xFieldName], y: point[yFieldName] };
            });

            // add target value
            graph.target.push({
                x: this.interpolateValueByCurrentTime(
                    trajectory, currentTimestamp, xFieldName),
                y: this.interpolateValueByCurrentTime(
                    trajectory, currentTimestamp, yFieldName),
                t: currentTimestamp,
            });

            // add real value
            // adc = world.autoDrivingCar
            graph.real.push({ x: adc[xFieldName], y: adc[yFieldName] });

            // add auto-mode indicator
            const isCompleteAuto = (adc.disengageType === "DISENGAGE_NONE");
            graph.autoModeZone.push({
                x: adc[xFieldName],
                y: isCompleteAuto ? adc[yFieldName] : undefined,
            });
        }
    }

    setCurrentTargetPoint(graph, trajectoryPoint) {
        graph.currentTargetPoint = [];
        if (trajectoryPoint && trajectoryPoint.pathPoint) {
            graph.currentTargetPoint.push({
                x: trajectoryPoint.pathPoint.x,
                y: trajectoryPoint.pathPoint.y,
            });
        }
    }

    // 更新该实例对象的所有状态数据
    update(world) {
        const trajectory = world.planningTrajectory;
        const adc = world.autoDrivingCar;
        if (trajectory && adc) {
            this.updateAdcStatusGraph(this.data.speedGraph,
                trajectory, adc, 'timestampSec', 'speed');
            this.updateAdcStatusGraph(this.data.accelerationGraph,
                trajectory, adc, 'timestampSec', 'speedAcceleration');
            this.updateAdcStatusGraph(this.data.curvatureGraph,
                trajectory, adc, 'timestampSec', 'kappa');

            // trajectory graph update
            this.updateAdcStatusGraph(this.data.trajectoryGraph,
                trajectory, adc, 'positionX', 'positionY');
            // this.updateSteerCurve(this.data.trajectoryGraph, adc, vehicleParam);
            this.data.pose.x = adc.positionX;
            this.data.pose.y = adc.positionY;
            this.data.pose.heading = adc.heading;
        }

        // 关于控制效果的数据
        if (world.controlData) {
            const control = world.controlData;
            this.setCurrentTargetPoint(this.data.trajectoryGraph, control.currentTargetPoint);
            const timestamp = control.timestampSec;
            this.updateErrorGraph(this.data.stationErrorGraph, timestamp, control.stationError);
            this.updateErrorGraph(this.data.lateralErrorGraph, timestamp, control.lateralError);
            this.updateErrorGraph(this.data.headingErrorGraph, timestamp, control.headingError);
            this.updateTime(timestamp);
        }
    }
}
