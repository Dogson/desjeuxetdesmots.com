import React from "react"
import styles from "./header.module.scss"
import {NavLink} from "react-router-dom";
import ReactTooltip from 'react-tooltip'
import cx from "classnames";
import {Logo} from "../logo/logo";

const Header = ({smallHeader}) => (
    <div className={cx(styles.headerContainer, {[styles.smallHeader]: smallHeader})}>
        <NavLink className={styles.titleContainer} to={"/"}>
            <div className={styles.logo}>
                <Logo/>
            </div>
            <span>Des jeux et des mots</span>
        </NavLink>
        <ReactTooltip effect="solid" id="adminPanel" place="left"/>
    </div>
);

export default Header