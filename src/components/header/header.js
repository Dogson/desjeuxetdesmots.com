import React from "react"
import styles from "./header.module.scss"
import logo from "../../assets/logos/gamerJuice/logo.png";
import {NavLink} from "react-router-dom";
import {FaCog} from "react-icons/fa";
import ReactTooltip from 'react-tooltip'

const Header = () => (
    <div className={styles.headerContainer}>
        <NavLink className={styles.titleContainer} to={"/"}>
            <span>gamer juice</span>
            <div className={styles.logo}>
                <img src={logo} alt="gamer juice" width="100%"/>
            </div>
        </NavLink>
        <NavLink className={styles.adminButtonContainer} to={"/admin"} data-tip="panneau d'administration">
            <FaCog/>
        </NavLink>
        <ReactTooltip effect="solid" />
    </div>
);

export default Header