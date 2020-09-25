import React from "react";
import camera from 'assets/1.png'

export class CameraVideo extends React.Component {
    render() {
        return (
            <div className="camera-video">
                <img src={camera}/>
            </div>
        );
    }
}

export default class SensorCamera extends React.Component {
    render() {
        return (
            <div className="card camera">
                <div className="card-header"><span>Camera View</span></div>
                {/* <div className="card-header"><span>摄像头画面</span></div> */}
                <div className="card-content-column">
                    <CameraVideo />
                </div>
            </div>
        );
    }
}
