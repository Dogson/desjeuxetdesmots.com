import PageLayout from "../../layouts/PageLayout";
import {Helmet} from "react-helmet";
import React from "react";
import styles from "./pageNotFound.module.scss";
import {NavLink} from "react-router-dom";

export const PageNotFound = () => {
    return <PageLayout>
        <Helmet title="Page non trouvée"/>
        <div className={styles.notFoundContainer}>
            <div className={styles.title}>404</div>
            <div className={styles.subtitle}>
                La page demandée n'existe pas
            </div>
            <NavLink className={styles.btn} to={"/"}>Retourner sur la page d'accueil</NavLink>
        </div>
    </PageLayout>
}
