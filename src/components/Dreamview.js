import React from "react";
import SplitPane from 'react-split-pane';
import Header from './Header';
import MainView from './Layouts/MainView';
import ToolView from './Layouts/ToolView';
import SideBar from './SideBar';
// import { Layout } from 'antd';
// const { Header, Footer, Sider, Content } = Layout;


export default class Dreamview extends React.Component {
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