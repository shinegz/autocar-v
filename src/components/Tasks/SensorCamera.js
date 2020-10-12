import React from "react";
import Flvjs from 'flv.js';

export class CameraVideo extends React.Component {
    componentDidMount() {
        if (Flvjs.isSupported()) {
            var videoElement = document.getElementById('videoElement');
            var flvPlayer = Flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                // url: 'http://192.168.83.129:8080/live/livestream.flv'
                url: 'ws://10.23.21.102:8081/live/livestream.flv'
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
        }
    }

    render() {
        return (
            <div className="camera-video">
                <video id="videoElement"></video>
            </div>
        );
    }
}

export default class SensorCamera extends React.Component {
    render() {
        return (
            <div className="card camera">
                <div className="card-header"><span>Camera View</span></div>
                <div className="card-content-column">
                    <CameraVideo />
                </div>
            </div>
        );
    }
}
