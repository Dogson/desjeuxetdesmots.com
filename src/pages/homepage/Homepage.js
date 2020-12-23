import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import styles from "./homepage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {NavLink, withRouter} from 'react-router-dom'
import GameGridContainer from "../../components/gameGrid/gameGrid";
import {Logo} from "../../components/logo/logo";


class Homepage extends Component {
    render() {
        return <PageLayout>
            <Helmet defer={false}>
                <title>{this.props.searchInput && this.props.searchInput.length > 0 ? `Recherche: ${this.props.searchInput}` : 'Des jeux et des mots - Podcasts et vidéos de jeux vidéos'}</title>
            </Helmet>
            <NavLink className={styles.titleContainer} to={"/"}>
                <div className={styles.logo}>
                    <Logo/>
                </div>
                <span className={styles.logoTitle}>Des jeux et des mots</span>
            </NavLink>
            <div className={styles.subtitle}>Prendre le temps d'écouter celles et ceux qui prennent le temps d'analyser
                vos jeux favoris.
            </div>
            <GameGridContainer/>
        </PageLayout>
    }
}

export default withRouter(Homepage);