import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import styles from "./homepage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom'
import GameGridContainer from "../../components/gameGrid/gameGrid";


class Homepage extends Component {
    render() {
        return <PageLayout>
            <Helmet>
                <title>{this.props.searchInput && this.props.searchInput.length > 0 ? `Recherche: ${this.props.searchInput}` : 'Des jeux et des mots - Podcasts et vidéos de jeux vidéos'}</title>
            </Helmet>
            <div className={styles.subtitle}>Prendre le temps d'écouter celles et ceux qui prennent le temps d'analyser
                vos jeux favoris.
            </div>
            <GameGridContainer />
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        games: state.gamesReducer.games,
        searchInput: state.gamesReducer.searchInput,
        page: state.gamesReducer.page,
        currentGame: state.gamesReducer.currentGame,
        settings: state.settingsReducer.settings
    }
};

export default withRouter(connect(mapStateToProps)(Homepage));