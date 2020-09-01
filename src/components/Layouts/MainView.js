import React from "react";
// import { inject, observer } from "mobx-react";
// import Loadable from 'react-loadable';

// import RouteEditingBar from "components/RouteEditingBar";
// import StatusBar from "components/StatusBar";
// import Scene from "components/Scene";
import Loader from "../common/Loader";
// import PlaybackControls from "components/PlaybackControls";

// const Navigation = Loadable({
//     loader: () => import("components/Navigation"),
//     loading() {
//         return <div className="navigation-view">Loading...</div>;
//     }
// });

// @inject("store") @observer
// class SceneView extends React.Component {
//     render() {
//         const { dimension, meters, monitor,
//                 hmi, options, trafficSignal } = this.props.store;

//         return (
//             <React.Fragment>
//                 <Scene
//                     width={dimension.scene.width}
//                     height={dimension.scene.height}
//                     options={options}
//                     shouldDisplayOnRight={dimension.shouldDivideSceneAndMapSpace} />
//                 {options.showRouteEditingBar
//                     ? <RouteEditingBar />
//                     : <StatusBar meters={meters}
//                                  trafficSignal={trafficSignal}
//                                  showNotification={!options.showTasks}
//                                  showPlanningRSSInfo={options.showPlanningRSSInfo}
//                                  monitor={monitor} />}
//                 {OFFLINE_PLAYBACK && <PlaybackControls />}
//                 {hmi.shouldDisplayNavigationMap &&
//                     <Navigation onResize={() => dimension.toggleNavigationSize()}
//                                 hasRoutingControls={hmi.inNavigationMode}
//                                 {...dimension.navigation} />}
//             </React.Fragment>
//         );
//     }
// }

// @inject("store") @observer
export default class MainView extends React.Component {
    render() {
        // const { isInitialized, dimension } = this.props.store;

        // const height = dimension.main.height;
        return (
            <div className="main-view" style={{ height:window.innerHeight*0.6 }}>
                {/* {(!isInitialized && !OFFLINE_PLAYBACK) ? <Loader /> : <SceneView />} */}
                <Loader />
            </div >
        );
    }
}