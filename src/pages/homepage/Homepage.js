import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {DebounceInput} from 'react-debounce-input';
import cx from "classnames";
import styles from "./homepage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {getGamesBySearch} from "../../endpoints/gamesEndpoint";
import {connect} from "react-redux";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import {FaSearch} from "react-icons/fa";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner"
import {NavLink, withRouter} from 'react-router-dom'
import queryString from "query-string/index";
import InfiniteScroll from 'react-infinite-scroller';
import {ErrorMessage} from "../../components/errorMessage/errorMessage";
import {isEqual} from "lodash";


class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreGames: true,
            loading: false,
            error: false
        };

        this._handleChange = this._handleChange.bind(this);
        this.getMoreGames = this.getMoreGames.bind(this);
    }

    componentDidMount() {
        this.props.dispatch({type: ACTIONS_GAMES.SET_CURRENT_GAME, payload: null});
    }

    componentDidUpdate(prevProps) {
        const currentValues = queryString.parse(this.props.location.search);
        const prevValues = queryString.parse(prevProps.location.search);
        if (prevValues.q !== currentValues.q) {
            this.setState({hasMoreGames: true});
        }

        if (this.props.currentGame) {
            this.props.history.push(`/game/${this.props.currentGame._id}`)
        }

        if (currentValues.q !== prevValues.q) {
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: {games: [], page: 1}});
        }

        const {filters} = this.props.settings;
        const prevFilters = prevProps.settings.filters;

        if (!isEqual(filters.medias, prevFilters.medias)) {
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: {games: [], page: 1}});
            this.setState({hasMoreGames: true})
        }

    }

    _handleChange(value) {
        this.props.history.push(`/?q=${value}`);
    }

    async getMoreGames() {
        const searchInput = queryString.parse(this.props.location.search).q;
        if (this.state.loading || this.state.error) {
            return;
        }
        this.setState({loading: true, error: false});
        const page = this.props.page || 1;
        const search = searchInput;
        const previousGamesArray = this.props.games || [];
        try {
            const games = await getGamesBySearch({name: search, page});
            this.setState({hasMoreGames: games.length > 0 && (!search || search.length === 0)});
            this.props.dispatch({
                type: ACTIONS_GAMES.SET_GAMES,
                payload: {games: previousGamesArray.concat(games), page: page + 1}
            });
        } catch (err) {
            this.setState({error: true})
        }
        this.setState({loading: false})
    }


    //render functions

    renderGameGrid() {
        return <InfiniteScroll
            loadMore={this.getMoreGames}
            hasMore={this.state.hasMoreGames && !this.state.error}
            loader={<div className={styles.loaderContainer} key={0}><LoadingSpinner/></div>}
        >

            {this.state.error ?
                <ErrorMessage>Une erreur est survenue lors du chargement des jeux.</ErrorMessage> :
                <GameGrid games={this.props.games} loading={this.state.loading}/>

            }
        </InfiniteScroll>
    };

    render() {
        const searchInput = queryString.parse(this.props.location.search).q;
        return <PageLayout>
            <Helmet>
                <title>{this.props.searchInput && this.props.searchInput.length > 0 ? `Recherche: ${this.props.searchInput}` : 'Des jeux et des mots'}</title>
            </Helmet>
            <div className={styles.subtitle}>Prendre le temps d'écouter celles et ceux qui prennent le temps d'analyser
                vos jeux favoris.
            </div>
            <div className={cx(styles.inputContainer, {[styles.focus]: this.state.inputFocused})}>
                <FaSearch className={styles.icon}/>
                <DebounceInput
                    value={searchInput}
                    className={styles.input}
                    minLength={2}
                    debounceTimeout={300}
                    onChange={(e) => this._handleChange(e.target.value)}
                    placeholder="Rechercher un jeu"
                    onFocus={() => this.setState({inputFocused: true})}
                    onBlur={() => this.setState({inputFocused: false})}/>
            </div>
            {this.renderGameGrid()}
        </PageLayout>
    }
}

const GameGrid = ({games, loading}) => {
    if (!games)
        return null;
    if (games.length === 0 && !loading) {
        return <div className={styles.noResultContainer}>
            <div><strong>Aucun jeu ne correspond à votre recherche.</strong></div>
            <div>Cela signifie probablement qu'aucun média n'a été encore publié à son sujet.</div>
        </div>
    }
    return <div className={styles.gamesGridContainer}>
        {
            games.map((game) => {
                return <NavLink to={{
                    pathname: `/game/${game._id}`,
                    game
                }}
                                className={styles.cardContainer}
                                key={game._id}>
                    <div className={styles.backImage} style={{backgroundImage: `url(${game.cover})`}}/>
                    <div className={styles.hoveredInfo}>
                        <div className={styles.backColor}/>
                        <div className={styles.title}>
                            {game.name}
                        </div>
                        <div className={styles.secondaryInfoContainer}>
                            {game.formattedDate}
                        </div>
                        <MediasSummary game={game}/>
                    </div>
                </NavLink>
            })
        }
    </div>
};

const MediasSummary = ({game}) => {
    const nbVideos = game.episodes.filter((ep) => {
        return ep.media.type === "video"
    }).length;
    const nbPodcasts = game.episodes.length - nbVideos;

    return <div className={styles.mediasSummaryContainer}>
        <div>
            {nbPodcasts > 0 &&
            <div className={styles.badge}>
                <span className={styles.number}>{nbPodcasts}</span>
                <span>podcasts</span>
                <span className={styles.emoji}>🎙️</span>
            </div>}
            {nbVideos > 0 &&
            <div className={styles.badge}>
                <span className={styles.number}>{nbVideos}</span>
                <span>vidéos</span>
                <span className={styles.emoji}>🎥</span>
            </div>
            }
        </div>
    </div>
};

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