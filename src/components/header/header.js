import React from "react"
import styles from "./header.module.scss"
import logo from "../../assets/logos/gamerJuice/logo.png";
import {NavLink} from "react-router-dom";
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
        <ReactTooltip effect="solid" id="adminPanel" place="left"/>
    </div>
);

export default Header