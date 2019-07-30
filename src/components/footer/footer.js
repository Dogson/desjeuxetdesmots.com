import React from "react"
import styles from "./footer.module.scss"

const Footer = () => (
    <div className={styles.footerContainer}>
        <div className={styles.copyrightContainer}>© <strong>Gwenaël Girod</strong>, fresh gamer juice producer, 2019-3019</div>
    </div>
);

export default Footer;