import React from 'react';
import styles from "./trashWidget.module.scss";

export const TrashWidget = ({color}) => {
    color = color || "black";
    return <div className={styles.trashContainer}><span className={styles.trash} style={{background: color}}>
			<span style={{background: color}}/>
			<i/>
		</span></div>
};