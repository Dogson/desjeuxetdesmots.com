import React from "react";
import styles from "./adminMediaSection.module.scss";

class AdminMediaSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, dataLabel, logo} = this.props.type;
        return <div className={styles.adminMediaSectionContainer}>
            <img className={styles.imageContainer} src={logo}/>
        </div>
    }
}

export default AdminMediaSection;