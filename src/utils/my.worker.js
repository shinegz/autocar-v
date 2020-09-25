const protobuf = require('protobufjs/light');
const simWorldRoot = protobuf.Root.fromJSON(
    require('proto_bundle/test.json')
);

const SimWorldMessage = simWorldRoot.lookupType("apollo.dreamview.SimulationWorld");

self.addEventListener("message", event => {
    // 接收主线程发送的消息
    let message = null;
    const data = event.data.data;
    switch (event.data.source) {
        case "realtime":
            if (typeof data === "string") {
                message = JSON.parse(data);
            } else {
                // console.log('gz')
                // console.log(SimWorldMessage)
                message = SimWorldMessage.toObject(
                    SimWorldMessage.decode(new Uint8Array(data)),
                    { enums: String });
                message.type = "SimWorldUpdate";
                console.log(message)
            }
            break;
        case "map":
            message = mapMessage.toObject(
                mapMessage.decode(new Uint8Array(data)),
                {enums: String});
            message.type = "MapData";
            break;
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


    // console.log('webworker')

    if (message) {
        // 向主线程发送消息
        self.postMessage(message);
    }
});

