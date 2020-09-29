import React from 'react';
import styles from "./errorMessage.module.scss"
import {FaExclamationCircle} from "react-icons/fa";

export const ErrorMessage = ({children}) => {
    return <div className={styles.errorContainer}>
        <FaExclamationCircle className={styles.icon}/>
        {children}
    </div>
}