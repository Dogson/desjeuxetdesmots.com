import React from "react"
import {Header, MobileDrawer} from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./pageLayout.module.scss";
import {connect} from "react-redux";
import {LoadingSpinner} from "../components/loadingSpinner/loadingSpinner";

const Layout = ({children, title, smallHeader, mediaFilters}) => {
    return  <div className={styles.pageContainer}>
        {smallHeader && <MobileDrawer/>}
        <Header smallHeader={smallHeader} hideSettings={!mediaFilters}/>
        <div className={styles.pageContent}>
            {title ? <div className={styles.titleContainer}>{title}</div> : null}
            {mediaFilters ? children : <LoadingSpinner/>}
        </div>
        <Footer/>
    </div>
}

const mapStateToProps = state => {
    return {
        mediaFilters: state.settingsReducer.settings.filters.medias,
    }
};

export default connect(mapStateToProps)(Layout);