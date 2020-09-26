import React from "react"
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./pageLayout.module.scss";

export default ({children, title, smallHeader}) => (
    <div className={styles.pageContainer}>
        <Header smallHeader={smallHeader} />
        <div className={styles.pageContent}>
            {title ? <div className={styles.titleContainer}>{title}</div> : null}
            {children}
        </div>
        <Footer/>
    </div>
)
