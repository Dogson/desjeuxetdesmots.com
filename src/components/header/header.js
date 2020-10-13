import React from "react"
import styles from "./header.module.scss"
import {NavLink} from "react-router-dom";
import cx from "classnames";
import {Logo} from "../logo/logo";
import Settings from "../settings/settings";

const Header = ({smallHeader}) => (
    <div className={cx(styles.headerContainer, {[styles.smallHeader]: smallHeader})}>
        <NavLink className={styles.titleContainer} to={"/"}>
            <div className={styles.logo}>
                <Logo/>
            </div>
            <span className={styles.title}>Des jeux et des mots</span>
        </NavLink>
        <Settings/>
    </div>
);

export default Header