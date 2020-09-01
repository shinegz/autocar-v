import React from "react";
import SideBarButton from './SideBarButton';
import ReactTooltip from "react-tooltip";

import TasksIcon from "../../assets/images/sidebar/tasks.png";
import ModuleControllerIcon from "../../assets/images/sidebar/module_controller.png";
import LayerMenuIcon from "../../assets/images/sidebar/layer_menu.png";
import RouteEditingIcon from "../../assets/images/sidebar/route_editing.png";
import DataRecorderIcon from "../../assets/images/sidebar/data_recorder.png";


export default class SideBar extends React.Component {
    render() {
        return (
            <div className="side-bar">
                <div className="main-panel">
                    <SideBarButton type="main" iconSrc={TasksIcon} label={"模块控制"} />
                    <SideBarButton type="main" iconSrc={ModuleControllerIcon} label={"模块控制"} />
                    <SideBarButton type="main" iconSrc={LayerMenuIcon} label={"模块控制"} />
                    <SideBarButton type="main" iconSrc={RouteEditingIcon} label={"模块控制"} />
                    <SideBarButton type="main" iconSrc={DataRecorderIcon} label={"模块控制"} />
                </div>
                <div className="sub-button-panel">
                    {/* <SideBarButton
                        type="sub" {...settings.showPOI}
                         /> */}
                </div>
                <ReactTooltip id="sidebar-button" place="right" delayShow={500} />
            </div>
        );
    }
}