import React from "react"
import {Header, MobileDrawer} from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./pageLayout.module.scss";
import {connect} from "react-redux";
import cx from "classnames";
import CookieConsent from "../components/cookieConsent/cookieConsent";

const Layout = ({children, title, smallHeader, mobileDrawerOpen, cookieConsent, dark, hideSettings}) => {
    return  <div className={styles.pageContainer}>
        {smallHeader && <MobileDrawer/>}
        <Header smallHeader={smallHeader} hideSettings={hideSettings}/>
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