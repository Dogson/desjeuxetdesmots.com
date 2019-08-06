import React from 'react';
import styles from "./loadingSpinner.module.scss";
import cx from "classnames";
import logo from "../../assets/logos/gamerJuice/logo.png";
import {FaGamepad} from "react-icons/fa";

export const LoadingSpinner = () => {
    return <div className={styles.loadingContainer}>
        <div className={styles.flipCard}>
            <div className={cx(styles.flipCardInner, styles.rotateVertCenter)}>
                <div className={styles.flipCardFront}>
                    <img src={logo} alt={"loading"} className={styles.icon}/>
                </div>
                <div className={styles.flipCardBack}>
                    <FaGamepad className={styles.icon}/>
                </div>
            </div>
        </div>
    </div>
};