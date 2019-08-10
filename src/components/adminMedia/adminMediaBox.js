import React from "react";
import styles from "./adminMediaBox.module.scss";

export class AdminMediaBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {media} = this.props;
        console.log(media);

        return <div className={styles.adminMediaBoxContainer}>
            <div className={styles.leftRow}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>
                        {media.name}
                    </div>
                    <div className={styles.date}>
                        {media.releaseDate.format('DD/MM/YYYY')}
                    </div>
                </div>
                <div className={styles.description}>
                    {media.description}
                </div>
            </div>
            <div className={styles.rightRow}>
            </div>
        </div>
    }
}