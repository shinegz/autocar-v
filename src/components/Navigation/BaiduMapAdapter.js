import { WGS84ToBD09LL } from "utils/coordinate_converter";

export default class BaiduMapAdapter {
    constructor() {
        this.map = null;
        this.controls = [];
        this.initializedCenter = false;
    }

    isInitialized() {
        return this.map !== null && Object.keys(this.map).length > 0;
    }

    // 加载地图
    loadMap(initPoint, divElementName) {
        // 在指定的容器内创建地图实例
        this.map = new BMapGL.Map(divElementName);
        
        // 初始化地图实例
        this.map.centerAndZoom(initPoint, 19);
        this.map.enableScrollWheelZoom();
        this.map.setTrafficOn();
        // this.map.addControl(
        //     new BMap.MapTypeControl({
        //         anchor: BMAP_ANCHOR_TOP_LEFT,
        //         type: BMAP_NAVIGATION_CONTROL_SMALL,
        //     })
        // );

        this.map.addControl(
            new BMapGL.NavigationControl3D({
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT
            })
        );
    }

    // 设置地图中心点
    setCenter(point) {
        if (this.initializedCenter) {
            this.map.setCenter(point);
        } else {
            this.map.centerAndZoom(point, 19);
            this.initializedCenter = true;
        }
    }

    // 设置地图放大级别
    setZoom(zoom) {
        this.map.setZoom(zoom);
    }

    // 添加事件侦听器
    addEventHandler(eventName, handlerFunction) {
        this.map.addEventListener(eventName, event => {
            const clickedLatLng = event.latlng;
            handlerFunction(clickedLatLng);
        });
    }

    // 生成一个点
    createPoint({ lat, lng }) {
        return new BMapGL.Point(lng, lat);
    }

    // 生成一个标记
    createMarker(point, title, draggable = true) {
        let label = null;
        if (title) {
            label = new BMapGL.Label(title, {
                position: point,
                offset: new BMapGL.Size(15, -30),
            });
            label.setStyle({
                color: 'red',
                fontSize: '12px'
            });
        }

        const marker = new BMapGL.Marker(point, {
            enableDragging: draggable,
            rotation: 5,
        });
        marker.setLabel(label);
        this.map.addOverlay(marker);
        return marker;
    }

    // 生成一条折线
    createPolyline(path, color, opacity = 1, weight = 2.0) {
        // console.log("生成一条折线，路径点：");
        // console.log(path);
        const options = {
            geodesic: true,
            strokeStyle: "solid",
            strokeColor: color,
            strokeOpacity: opacity,
            strokeWeight: weight,
        };
        const polyline = new BMapGL.Polyline(path, options);
        this.map.addOverlay(polyline);
        return polyline;
    }

    // 添加控件
    createControl({ text, tip, color, offsetX, offsetY, onClickHandler }) {
        const myControl = new NavigationControl(
            text,
            tip,
            color,
            new BMapGL.Size(offsetX, offsetY),
            onClickHandler
        );
        this.map.addControl(myControl);
        this.controls.push(myControl);
    }

    // 移除控件
    disableControls() {
        this.controls.forEach(control => {
            this.map.removeControl(control);
        });
    }

    // 使能控件
    enableControls() {
        this.controls.forEach(control => {
            this.map.addControl(control);
        });
    }

    getMarkerPosition(marker) {
        return marker.getPosition();
    }

    updatePolyline(polyline, newPath) {
        // console.log("更新路径，新的路径点为：")
        // console.log(newPath);
        // console.log(polyline);
        polyline.setPath(newPath);
    }

    removePolyline(polyline) {
        this.map.removeOverlay(polyline);
    }

    // 将WGS84坐标转换为百度坐标
    applyCoordinateOffset([lng, lat]) {
        return WGS84ToBD09LL(lng, lat);  
    }
}

// 自定义控件
class NavigationControl extends BMapGL.Control {
    constructor(text, tip, color, offset, onClickHandler, ...args) {
        super(...args);
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = offset;
        this.onClickHandler = onClickHandler;
        this.title = tip;
        this.text = text;
        this.backgroundColor = color;
    }

    // 重写BMapGL.Control的initialize方法，调用Map.addControl()方法添加控件时将调用此方法
    initialize(map) {
        const controlDiv = document.createElement("div");

        // Set CSS for the control border.
        const controlUI = document.createElement("div");
        controlUI.style.backgroundColor = this.backgroundColor;
        controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "3px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginBottom = "22px";
        controlUI.style.textAlign = "center";
        controlUI.title = this.title;
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        const controlText = document.createElement("div");
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "38px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";
        controlText.innerHTML = this.text;
        controlUI.appendChild(controlText);

        map.getContainer().appendChild(controlDiv);

        controlUI.addEventListener("click", () => {
            this.onClickHandler(controlText);
        });

        return controlDiv;
    }
}
