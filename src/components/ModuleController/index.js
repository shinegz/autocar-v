import React from "react";
// import { inject, observer } from "mobx-react";

import CheckboxItem from "../../components/common/CheckboxItem";
import StatusDisplay from "./StatusDisplay";
// import WS from "store/websocket";

// @inject("store") @observer
export default class ModuleController extends React.Component {
    render() {
        // const { modes, currentMode, moduleStatus, componentStatus } = this.props.store.hmi;
        const componentStatus = {
            GPS: { status: 'Ok'},
            CAN: { status: 'ERR'}
        };

        const moduleStatus= {
            GPS: true,
            CAN: false
        };

        const moduleEntries = Array.from(Object.keys(moduleStatus)).sort().map(key => {
                return <CheckboxItem key={key} id={key} title={key}
                                     disabled={false} isChecked={moduleStatus[key]}
                                     onClick={() => {
                                        //  this.props.store.hmi.toggleModule(key);
                                     }}
                                     extraClasses="controller" />;
            });

        const componentEntries = Array.from(Object.keys(componentStatus)).sort().map(key => {
                return <StatusDisplay key={key} title={key}
                                      status={componentStatus[key]} />;
            });

        return (
            <div className="module-controller">
                <div className="card">
                    <div className="card-header"><span>Components</span></div>
                    <div className="card-content-column">
                        {componentEntries}
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><span>Modules</span></div>
                    <div className="card-content-row">
                        {moduleEntries}
                    </div>
                </div>
            </div>
        );
    }
}
