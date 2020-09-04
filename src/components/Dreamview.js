import React from "react";
import { inject, observer } from "mobx-react";
import SplitPane from 'react-split-pane';
import Header from './Header';
import MainView from './Layouts/MainView';
import ToolView from './Layouts/ToolView';
import SideBar from './SideBar';
// import { Layout } from 'antd';
// const { Header, Footer, Sider, Content } = Layout;
import WS from '../store/websocket';

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


export default class Dreamview extends React.Component {

  componentDidMount() {
    WS.initialize();
    // MAP_WS.initialize();
    // POINT_CLOUD_WS.initialize();
    // CAMERA_WS.initialize();
    // window.addEventListener("resize", this.updateDimension, false);
    // window.addEventListener("keypress", this.handleKeyPress, false);
  }

  render() {
      return (
          <div>
              <Header />
          <div className="pane-container">
              <SplitPane split={"vertical"}
                  size={window.innerWidth}
                  >
                  <div className="left-pane">
                      <SideBar />
                      <div className="dreamview-body">
                          <MainView />
                          <ToolView />
                      </div>
                  </div>
                  {/* <MonitorPanel
                      hmi={hmi}
                      viewName={options.monitorName}
                      showVideo={options.showVideo} /> */}
                  <h1 style={{color: '#fff',fontSize: '40px'}}>Apollo</h1>
              </SplitPane>
          </div>
      </div>
      );
  }
}