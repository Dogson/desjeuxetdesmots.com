import React from "react";
import {PODCASTS} from "../../config/const";
import AdminMediaRow from "../adminMediaRow/adminMediaRow";

export class AdminMediaSection extends React.Component {

    render() {
        const {name, constName, logo, medias} = this.props.type;
        return <div>
            {
                medias.map((item) => {
                    return <AdminMediaRow type={item} key={item.dataLabel}/>
                })
            }

        </div>
    }
}