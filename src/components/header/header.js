import React from "react"
import styles from "./header.module.scss"
import logo from "../../assets/logos/gamerJuice/logo.png";
import {NavLink} from "react-router-dom";
import {FaCog} from "react-icons/fa";
import ReactTooltip from 'react-tooltip'
import cx from "classnames";

const Header = ({smallHeader}) => (
    <div className={cx(styles.headerContainer, {[styles.smallHeader]: smallHeader})}>
        <NavLink className={styles.titleContainer} to={"/"}>
            <span>gamer juice</span>
            <div className={styles.logo}>
                <img src={logo} alt="gamer juice" width="100%"/>
            </div>
        </NavLink>
        <NavLink className={styles.adminButtonContainer} to={"/admin"} data-tip="panneau d'administration"
                 data-for="adminPanel">
            <FaCog/>
        </NavLink>
        <ReactTooltip effect="solid" id="adminPanel" place="left"/>
    </div>
);

export default Header