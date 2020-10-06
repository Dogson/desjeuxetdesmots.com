import React from 'react';
import styles from "./loadingSpinner.module.scss";
import cx from "classnames";
import {FaGamepad, FaCommentDots} from "react-icons/fa";

export const LoadingSpinner = ({size}) => {
    return <div className={styles.loadingContainer}>
        <div className={styles.flipCard} style={size && {height: size+"px", width: size+"px"}}>
            <div className={cx(styles.flipCardInner, styles.rotateVertCenter)}>
                <div className={styles.flipCardFront}>
                    <FaCommentDots className={styles.icon} style={size && {fontSize: (size*(2/3))+"px", height: (size*(2/3))+"px"}}/>
                </div>
                <div className={styles.flipCardBack}>
                    <FaGamepad className={styles.icon} style={size && {fontSize: (size*(2/3))+"px", height: (size*(2/3))+"px"}}/>
                </div>
            </div>
        </div>
    </div>
};