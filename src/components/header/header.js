import React from "react"
import styles from "./header.module.scss"
import {NavLink} from "react-router-dom";
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
    </div>
);

export default Header