import React from 'react';
import {connect} from "react-redux";
import styles from "./settings.module.scss"
import {FaCog} from "react-icons/fa";
import ReactTooltip from "react-tooltip";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }


    render() {
        return <div className={styles.settingsContainer}>
            <FaCog className={styles.adminButton} data-for="settings" data-tip="Paramètres"
                   onClick={() => this.setState({isOpen: true})}/>
            <ReactTooltip effect="solid" id="settings" place="left"/>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settingsReducer.settings,
    }
};

export default connect(mapStateToProps)(Settings);