import React from 'react';
import {connect} from "react-redux";
import styles from "./settings.module.scss"

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }


    render() {
        return <div className={styles.settingsContainer}>

        </div>
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settingsReducer.settings,
    }
};

export default connect(mapStateToProps)(Settings);