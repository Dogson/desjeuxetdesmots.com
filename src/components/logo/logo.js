import React from 'react';
import styles from "./logo.module.scss"
import {FaGamepad, FaCommentDots} from "react-icons/fa";

export const Logo = ({size}) => {
    return <div className={styles.logoContainer} style={size && {height: size + "px", width: size + "px"}}>
        <div className={styles.topContainer}>
            <FaGamepad className={styles.icon}
                       style={size && {fontSize: (size * (2 / 3)) + "px", height: (size * (2 / 3)) + "px"}}/>
        </div>
        <div className={styles.bottomContainer}>
            <FaCommentDots className={styles.icon}
                           style={size && {fontSize: (size * (2 / 3)) + "px", height: (size * (2 / 3)) + "px"}}/>

        </div>
    </div>
}