import React from "react";

import { MAP_SIZE } from "store/dimension";

export default class WindowResizeControl extends React.PureComponent {
    getMinimizingIcon() {
        return (
            <svg viewBox="0 0 20 20">
                <defs>
                    <path d="M20 0L0 20h20V0z" id="a" />
                    <path d="M11.53 18.5l-.03-7h7" id="b" />
                    <path d="M12 12l7 7" id="c" />
                </defs>
                <use xlinkHref="#a" opacity=".8" fill="#84b7FF" />
                <use xlinkHref="#b" fillOpacity="0" stroke="#006AFF" strokeWidth="2" />
                <use xlinkHref="#c" fillOpacity="0" stroke="#006AFF" strokeWidth="2" />
            </svg>
        );
    }

    getMaximizingIcon() {
        // return (
        //     <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
        //         <g>
        //         <title>background</title>
        //         <rect fill="#fff" id="canvas_background" height="402" width="582" y="-1" x="-1"/>
        //         </g>
        //         <g>
        //         <title>Layer 1</title>
        //         <path stroke="#000" id="svg_13" d="m165.962708,199.699773l-96.277988,-64.432209l0,32.216105l-38.602202,0l0,-141.78392l211.861011,0l0,25.833784l-48.13902,0l96.278023,64.432221l96.278023,-64.432221l-48.13902,0l0,-25.833784l211.860994,0l0,141.78392l-38.60222,0l0,-32.216105l-96.278005,64.432209l96.278005,64.432221l0,-32.216116l38.60222,0l0,141.783908l-211.860994,0l0,-25.833795l48.13902,0l-96.278023,-64.432186l-96.278023,64.432186l48.13902,0l0,25.833795l-211.861011,0l0,-141.783908l38.602202,0l0,32.216116l96.277988,-64.432221z" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" fill="none"/>
        //         </g>
        //     </svg>
        // );
        return (
            <svg viewBox="0 0 20 20">
                <defs>
                    <path d="M20 0L0 20h20V0z" id="a" />
                    <path d="M18.47 11.5l.03 7h-7" id="b" />
                    <path d="M11 11l7 7" id="c" />
                </defs>
                <use xlinkHref="#a" opacity=".8" fill="#84b7FF" />
                <use xlinkHref="#b" fillOpacity="0" stroke="#006AFF" strokeWidth="2" />
                <use xlinkHref="#c" fillOpacity="0" stroke="#006AFF" strokeWidth="2" />
            </svg>
        );
    }

    render() {
        const { type, onClick } = this.props;

        let icon = null;
        switch (type) {
            case MAP_SIZE.FULL:
                icon = this.getMinimizingIcon();
                break;
            case MAP_SIZE.DEFAULT:
                icon = this.getMaximizingIcon();
                break;
            default:
                console.error('Unknown window size found:', type);
                break;
        }

        return (
            <div className="window-resize-control" onClick={onClick}>
                {icon}
            </div>
        );
    }
}
