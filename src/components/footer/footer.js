import React from "react"
import styles from "./footer.module.scss"

const Footer = () => (
    <div className={styles.footerContainer}>
        <div className={styles.copyrightContainer}>© <strong>Produit par un amateur de jeux et de mots</strong>, 2019-3019</div>
    </div>
);

export default Footer;