import React from "react"
import {Header, DrawerSearch} from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./pageLayout.module.scss";
import {connect} from "react-redux";
import cx from "classnames";
import CookieConsent from "../components/cookieConsent/cookieConsent";
import {DrawerNav} from "../components/drawerMenuNav/drawerMenuNav";
import {NAV_ROUTES} from "../config/const";

const Layout = ({children, title, notHomeHeader, mobileDrawerOpen, cookieConsent, dark, hideSettings, noLogo}) => {
    return  <div className={styles.pageContainer}>
        {notHomeHeader && <DrawerSearch/>}
        <DrawerNav routes={NAV_ROUTES}/>
        <Header notHomeHeader={notHomeHeader} hideSettings={hideSettings} noLogo={noLogo}/>
        <div className={cx(styles.pageContent, {[styles.hidden]: mobileDrawerOpen}, {[styles.dark]: dark})}>
            {title ? <div className={styles.titleContainer}>{title}</div> : null}
            {children}
        </div>
        {!cookieConsent && <CookieConsent/>}
        <Footer/>
    </div>
}

const mapStateToProps = state => {
    return {
        mobileDrawerOpen: state.settingsReducer.settings.mobileDrawerOpen,
        cookieConsent: state.settingsReducer.cookieConsent
    }
};

export default connect(mapStateToProps)(Layout);