// import OfflinePlaybackWebSocketEndpoint from "./websocket_offline";
import RealtimeWebSocketEndpoint from "./websocket_realtime";
// import MapDataWebSocketEndpoint from "./websocket_map";
// import PointCloudWebSocketEndpoint from "./websocket_point_cloud";
// import CameraDataWebSocketEndpoint from "./websocket_camera";
// import TeleopWebSocketEndpoint from "./websocket_teleop";

// Returns the websocket server address based on the web server address.
// Follows the convention that the websocket is served on the same host/port
// as the web server.
function deduceWebsocketServerAddr(type) {
    const server = window.location.origin;
    const link = document.createElement("a");
    link.href = server; // 这是因为原项目前后端部署在一起
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    const port = '5000'
        // process.env.NODE_ENV === "production" ? window.location.port : PARAMETERS.server.port;

    let path = "";
    switch (type) {
        case "map":
            path = "map";
            break;
        case "point_cloud":
            path = "pointcloud";
            break;
        case "sim_world":
            // path = OFFLINE_PLAYBACK ? "offlineView" : "websocket";
            path = "websocket";
            break;
        case "camera":
            path = "camera";
            break;
        case "teleop":
            path = "teleop";
            break;
    }
    return `${protocol}://${link.hostname}:${port}/${path}`;
}

// NOTE: process.env.NODE_ENV will be set to "production" by webpack when
// invoked in production mode ("-p"). We rely on this to determine which
// websocket server to use.
const simWorldServerAddr = deduceWebsocketServerAddr("sim_world");
// const WS = OFFLINE_PLAYBACK
//     ? new OfflinePlaybackWebSocketEndpoint(simWorldServerAddr)
//     : new RealtimeWebSocketEndpoint(simWorldServerAddr);
const WS = new RealtimeWebSocketEndpoint(simWorldServerAddr);
export default WS;

// const mapServerAddr = deduceWebsocketServerAddr("map");
// export const MAP_WS = new MapDataWebSocketEndpoint(mapServerAddr);

// const pointCloudServerAddr = deduceWebsocketServerAddr("point_cloud");
// export const POINT_CLOUD_WS = new PointCloudWebSocketEndpoint(pointCloudServerAddr);

// const cameraServerAddr = deduceWebsocketServerAddr("camera");
// export const CAMERA_WS = new CameraDataWebSocketEndpoint(cameraServerAddr);

// const teleopServerAddr = deduceWebsocketServerAddr("teleop");
// export const TELEOP_WS = new TeleopWebSocketEndpoint(teleopServerAddr);
