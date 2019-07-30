import React from "react"
import styles from "./header.module.scss"
import logo from "../../assets/images/logo.png";
import {Link} from "react-router-dom";

const Header = () => (
    <div className={styles.headerContainer}>
        <Link className={styles.titleContainer} to={"/"}>
            <span>gamer juice</span>
            <div className={styles.logo}>
                <img src={logo} alt="gamer juice" width="100%"/>
            </div>
        </Link>
    </div>
);

export default Header