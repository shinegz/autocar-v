import React from "react";
import { inject, observer } from "mobx-react";

import SplitPane from 'react-split-pane';
import Header from 'components/Header';
import MainView from 'components/Layouts/MainView';
import ToolView from 'components/Layouts/ToolView';
import MonitorPanel from "components/Layouts/MonitorPanel";
import SideBar from 'components/SideBar';

import HOTKEYS_CONFIG from "store/config/hotkeys.yml";
import WS from 'store/websocket';

import Map from 'store/map/map.js'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

@inject("store") @observer
export default class Dreamview extends React.Component {
  constructor(props) {
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateDimension = this.props.store.dimension.update.bind(this.props.store.dimension);
  }

  handleDrag(masterViewWidth) {
    const { options, dimension } = this.props.store;
    if (options.showMonitor) {
      dimension.updateMonitorWidth(
        Math.min(
          Math.max(window.innerWidth - masterViewWidth, 0),
          window.innerWidth
        )
      );
    }
  }

  handleKeyPress(event) {
    const { options, enableHMIButtonsOnly, hmi } = this.props.store;

    const optionName = HOTKEYS_CONFIG[event.key];
    if (!optionName || options.showDataRecorder) {
      return;
    }

    event.preventDefault();
    if (optionName === "cameraAngle") {
      options.rotateCameraAngle();
    } else if (
      !options.isSideBarButtonDisabled(optionName, enableHMIButtonsOnly, hmi.inNavigationMode)
    ) {
      this.props.store.handleOptionToggle(optionName);
    }
  }

  UNSAFE_componentWillMount() {
    this.props.store.dimension.initialize();
  }

  componentDidMount() {
    WS.initialize();
    Map();
    // MAP_WS.initialize();
    // POINT_CLOUD_WS.initialize();
    // CAMERA_WS.initialize();
    window.addEventListener("resize", this.updateDimension, false);
    window.addEventListener("keypress", this.handleKeyPress, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimension, false);
    window.removeEventListener("keypress", this.handleKeyPress, false);
  }

  render() {
    const { dimension, options, hmi } = this.props.store;

    return (
      <div>
        <Header />
        <div className="pane-container">
          <SplitPane split={"vertical"}
            size={dimension.pane.width}
            onChange={this.handleDrag}
            // 拉帘使能标志位
            allowResize={options.showMonitor}
          >
            <div className="left-pane">
              <SideBar />
              <div className="dreamview-body">
                <MainView />
                <ToolView />
              </div>
            </div>
            <MonitorPanel
                      hmi={hmi}
                      viewName={options.monitorName}
                      showVideo={options.showVideo} />
            {/* <h1 style={{ color: '#fff', fontSize: '40px' }}>Apollo</h1> */}
          </SplitPane>
        </div>
      </div>
    );
  }
}
