import React from "react";
// import { inject, observer } from "mobx-react";

// import DataRecorder from "components/DataRecorder";
import ModuleController from "../../components/ModuleController";
// import Menu from "components/SideBar/Menu";
// import POI from "components/SideBar/POI";
// import Tasks from "components/Tasks";

// @inject("store") @observer
export default class ToolView extends React.Component {
    render() {
        // const { options, routeEditingManager, hmi, newDisengagementReminder } = this.props.store;

        return (
            <div className="tools">
                <ModuleController />
                {/* {options.showTasks && <Tasks options={options}/>}
                {options.showModuleController && <ModuleController />}
                {options.showMenu && <Menu options={options} />}
                {options.showPOI && (
                    <POI
                        routeEditingManager={routeEditingManager}
                        options={options}
                        inNavigationMode={hmi.inNavigationMode}
                    />
                )}
                {options.showDataRecorder && (
                    <DataRecorder
                        newDisengagementReminder={newDisengagementReminder}
                    />
                )} */}
            </div>
        );
    }
}