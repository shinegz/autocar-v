import * as THREE from "three";
import GentilisBold from "fonts/gentilis_bold.typeface.json";

const _ = require('lodash');

const fonts = {};
let fontsLoaded = false;
const loader = new THREE.FontLoader();
// const fontPath = "fonts/gentilis_bold.typeface.json";

const font = loader.parse(GentilisBold);
if (font.type === "Font") {
    fonts['gentilis_bold'] = font;
    fontsLoaded = true;
}
// console.log(font);
// loader.load(fontPath, font => {
//         console.log("font loaded");
//         fonts['gentilis_bold'] = font;
//         fontsLoaded = true;
//     },
//     function (xhr) {
//         console.log(xhr);
//         console.log(fontPath + (xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     function (err) {
//         console.log( 'An error happened when loading ' + fontPath );
// });

export default class Text3D {
    constructor() {
        // The meshes for each ASCII char, created and reused when needed.
        // e.g. {65: [mesh('a'), mesh('a')], 66: [mesh('b')]}
        // These meshes will not be deleted even when not in use,
        // as the construction is expensive.
        this.charMeshes = {};
        // Mapping from each ASCII char to the index of the mesh used
        // e.g. {65: 1, 66: 0}
        this.charPointers = {};
    }

    reset() {
        this.charPointers = {};
    }

    composeText(text) {
        if (!fontsLoaded) {
            console.log("fonts is unloaded");
            return null;
        }
        // 32 is the ASCII code for white space.
        const charIndices = _.map(text, l => l.charCodeAt(0) - 32);  // charIndices:[71, 90]
        console.log(charIndices);
        const letterOffset = 0.4;
        const textMesh = new THREE.Object3D();
        for (let j = 0; j < charIndices.length; j++) {
            const idx = charIndices[j];
            let pIdx = this.charPointers[idx];
            if (pIdx === undefined) {
                pIdx = 0;
                this.charPointers[idx] = pIdx;    // charPointers{'71':0}  charPointers{'71':1, '90':0}
            }
            if (this.charMeshes[idx] === undefined) {
                this.charMeshes[idx] = [];        // charMeshes{'71':[]}  charPointers{'90':[]}
            }
            let mesh = this.charMeshes[idx][pIdx];   // mesh:undefined
            if (mesh === undefined) {
                if (this.charMeshes[idx].length > 0) {
                    mesh = this.charMeshes[idx][0].clone();
                } else {
                    mesh = this.drawChar3D(text[j]);  // mesh: mesh('g')  mesh: mesh('z')
                }
                this.charMeshes[idx].push(mesh);   // charMeshes{'71':[mesh('g')], '90':[mesh('z')]}
            }
            mesh.position.set((j - charIndices.length / 2) * letterOffset, 0, 0);
            this.charPointers[idx]++;    // charPointers{'71': 1, '90': 1}
            textMesh.add(mesh);
        }
        return textMesh;
    }

    drawChar3D(char, font = fonts['gentilis_bold'], size = 0.6, height = 0.1,
            color = 0xFFEA00) {
        const charGeo = new THREE.TextGeometry(char, {
            font: font,
            size: size,
            height: height});
        const charMaterial = new THREE.MeshBasicMaterial({color: color});
        const charMesh = new THREE.Mesh(charGeo, charMaterial);
        return charMesh;
    }
}