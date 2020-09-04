// const protobuf = require("protobufjs/light");
// const simWorldRoot = protobuf.Root.fromJSON(
//     require("proto_bundle/sim_world_proto_bundle.json")
// );
// const SimWorldMessage = simWorldRoot.lookupType("apollo.dreamview.SimulationWorld");
// const mapMessage = simWorldRoot.lookupType("apollo.hdmap.Map");
// const cameraMessage = simWorldRoot.lookupType("apollo.dreamview.CameraUpdate");
// const pointCloudRoot = protobuf.Root.fromJSON(
//     require("proto_bundle/point_cloud_proto_bundle.json")
// );
// const pointCloudMessage = pointCloudRoot.lookupType("apollo.dreamview.PointCloud");

const workercode = () => {

    self.addEventListener("message", event => {
        // 接收主线程发送的消息
        let message = null;
        const data = event.data.data;
        switch (event.data.source) {
            case "realtime":
                if (typeof data === "string") {
                    message = JSON.parse(data);
                } else {
                    message = SimWorldMessage.toObject(
                        SimWorldMessage.decode(new Uint8Array(data)),
                        { enums: String });
                    message.type = "SimWorldUpdate";
                }
                break;
            // case "map":
            //     message = mapMessage.toObject(
            //         mapMessage.decode(new Uint8Array(data)),
            //         {enums: String});
            //     message.type = "MapData";
            //     break;
            // case "point_cloud":
            //     if (typeof data === "string") {
            //         message = JSON.parse(data);
            //     } else {
            //         message = pointCloudMessage.toObject(
            //             pointCloudMessage.decode(new Uint8Array(data)), {arrays: true});
            //     }
            //     break;
            // case "camera":
            //     message = cameraMessage.toObject(
            //         cameraMessage.decode(new Uint8Array(data)), { enums: String });
            //     message.type = "CameraData";
            //     break;
            // case "teleop":
            //     if (typeof data === "string") {
            //         message = JSON.parse(data);
            //     }
            //     break;
        }
    
    
        console.log('webworker')
    
        if (message) {
            // 向主线程发送消息
            self.postMessage(message);
        }
    });
    
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
