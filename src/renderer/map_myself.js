// import * as THREE from "three";
import { drawSegmentsFromPoints,
    drawDashedLineFromPoints } from "utils/draw";


export default class Map {
    constructor() {
        this.data = {};
    }

    appendMapData(mapData, coordinates, scene) {
        // console.log(mapData)
        mapData.forEach( way => {
            switch (way.lineType) {
                case "solid":
                    // console.log("solid");
                    const solidPoints = coordinates.applyOffsetToArray(way.points);
                    // console.log(solidPoints);
                    const solidLine = drawSegmentsFromPoints(solidPoints, 0XDAA520, 3, 1, false);
                    scene.add(solidLine);
                    break;
                case "dashed":
                    // console.log("dashed");
                    const dashedPoints = coordinates.applyOffsetToArray(way.points);
                    const dashedLine = drawDashedLineFromPoints(dashedPoints, 0xCCCCCC, 4, 3, 3, 1, false);
                    scene.add(dashedLine);
                    break;
                default: 
                    break;
            }
        });
    }
}