import React from "react"
import styles from "./header.module.scss"
import logo from "../../assets/logos/gamerJuice/logo.png";
import {NavLink} from "react-router-dom";

const Header = () => (
    <div className={styles.headerContainer}>
        <NavLink className={styles.titleContainer} to={"/"}>
            <span>gamer juice</span>
            <div className={styles.logo}>
                <img src={logo} alt="gamer juice" width="100%"/>
            </div>
        </NavLink>
    </div>
);

export default Header