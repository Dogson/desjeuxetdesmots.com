import React from 'react';
import styles from "./loadingSpinner.module.scss";
import cx from "classnames";
import {FaGamepad, FaCommentDots} from "react-icons/fa";

export const LoadingSpinner = ({size}) => {
    const flipCardCx = cx(
        styles.LoadingSpinner_flipCard,
        {[styles.LoadingSpinner_flipCard__small]: size === "small"}
    );

    const frontIconCx = cx(
        styles.LoadingSpinner_frontIcon,
        {[styles.LoadingSpinner_frontIcon__small]: size === "small"}
    );

    const backIconCx = cx(
        styles.LoadingSpinner_backIcon,
        {[styles.LoadingSpinner_backIcon__small]: size === "small"}
    );

    return (
        <div className={styles.LoadingSpinner}>
            <div className={flipCardCx}>
                <div className={styles.LoadingSpinner_inner}>
                    <div className={styles.LoadingSpinner_front}>
                        <FaCommentDots className={frontIconCx}/>
                    </div>
                    <div className={styles.LoadingSpinner_back}>
                        <FaGamepad className={backIconCx}/>
                    </div>
                </div>
            </div>
        </div>
    )
};