import React from "react";
import styles from "./adminMediaBox.module.scss";

export class AdminMediaBox extends React.Component {
    constructor(props) {
     super(props);
    }

    render() {
        const {media} = this.props;

        return <div className={styles.adminMediaBoxContainer}>{media.name}</div>
    }
}