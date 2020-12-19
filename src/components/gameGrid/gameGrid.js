import styles from "./gameGrid.module.scss";
import {NavLink, withRouter} from "react-router-dom";
import React from "react";
import cx from "classnames";
import {FaSearch} from "react-icons/fa";
import {DebounceInput} from "react-debounce-input";
import {ACTIONS_GAMES} from "../../actions/gamesActions";
import queryString from "query-string";
import {isEqual} from "lodash";
import {getGamesAndMediasBySearch} from "../../endpoints/gamesEndpoint";
import InfiniteScroll from "react-infinite-scroller";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import {ErrorMessage} from "../errorMessage/errorMessage";
import {connect} from "react-redux";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";

class GameGridContainer extends React.Component {
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
            this.props.dispatch({type: ACTIONS_MEDIAS.SET_SEARCHED_MEDIAS, payload: []});
        }

        const {filters} = this.props.settings;
        const prevFilters = prevProps.settings.filters;

        if (!isEqual(filters.medias, prevFilters.medias)) {
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: {games: [], page: 1}});
            this.props.dispatch({type: ACTIONS_MEDIAS.SET_SEARCHED_MEDIAS, payload: []});
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
            const params = {name: search, page};
            if (this.props.currentMedia) {
                params["media.name"] = this.props.currentMedia.name
            }
            const {games, medias} = await getGamesAndMediasBySearch(params);
            this.setState({hasMoreGames: games.length > 0 && (!search || search.length === 0)});
            this.props.dispatch({
                type: ACTIONS_GAMES.SET_GAMES,
                payload: {games: previousGamesArray.concat(games), page: page + 1}
            });
            this.props.dispatch({
                type: ACTIONS_MEDIAS.SET_SEARCHED_MEDIAS,
                payload: medias
            });
        } catch (err) {
            this.setState({error: true})
        }
        this.setState({loading: false})
    }

    renderGameGrid() {
        const {disableLogo, disableMediasSummary, games, searchedMedias} = this.props;
        const {loading} = this.state;
        return <InfiniteScroll
            loadMore={this.getMoreGames}
            hasMore={this.state.hasMoreGames && !this.state.error}
            loader={<div className={styles.loaderContainer} key={0}><LoadingSpinner/></div>}
        >

            {this.state.error ?
                <ErrorMessage>Une erreur est survenue lors du chargement des jeux.</ErrorMessage> :
                <>
                    {games && searchedMedias && games.length === 0 && searchedMedias.length === 0 && !loading ?
                        <div className={styles.noResultContainer}>
                            <div><strong>Aucun jeu ne correspond à votre recherche.</strong></div>
                            <div>Cela signifie probablement qu'aucun média n'a été encore publié à son sujet.</div>
                        </div> :
                        <>
                            <MediasGrid medias={searchedMedias} games={games}/>
                            <GameGrid games={games} loading={loading} disableLogo={disableLogo}
                                      disableMediasSummary={disableMediasSummary}/>
                        </>
                    }
                </>

            }
        </InfiniteScroll>
    };

    render() {
        const {disableSearch} = this.props;
        const searchInput = queryString.parse(this.props.location.search).q;
        return <>
            {!disableSearch && <div className={cx(styles.inputContainer, {[styles.focus]: this.state.inputFocused})}>
                <FaSearch className={styles.icon}/>
                <DebounceInput
                    value={searchInput}
                    className={styles.input}
                    minLength={2}
                    debounceTimeout={300}
                    onChange={(e) => this._handleChange(e.target.value)}
                    placeholder="Rechercher un jeu, un podcast, un·e vidéaste..."
                    onFocus={() => this.setState({inputFocused: true})}
                    onBlur={() => this.setState({inputFocused: false})}/>
            </div>}
            {this.renderGameGrid()}
        </>
    }
}

const mapStateToProps = state => {
    return {
        games: state.gamesReducer.games,
        searchInput: state.gamesReducer.searchInput,
        page: state.gamesReducer.page,
        currentGame: state.gamesReducer.currentGame,
        settings: state.settingsReducer.settings,
        currentMedia: state.mediaReducer.currentMedia,
        searchedMedias: state.mediaReducer.searchedMedias,
    }
};

export default withRouter(connect(mapStateToProps)(GameGridContainer));


const MediasGrid = ({medias, games}) => {
    if (!medias) {
        return null;
    }
    return <>
        <div className={styles.mediaGridContainer}>
            {medias.map((media) =>
                <NavLink to={`/media/${media.name}`}
                         className={styles.cardContainer}
                         key={media.name}>
                    <div className={styles.backImage} style={{backgroundImage: `url(${media.logo})`}}/>
                    <div className={styles.hoveredInfo}>
                        <div className={styles.backColor}/>
                        <div className={styles.title}>
                            {media.name}
                        </div>
                        <div className={styles.secondaryInfoContainer}>
                            {media.type === "video" ? "Vidéaste" : "Podcast"}
                        </div>
                    </div>
                </NavLink>
            )}

        </div>
        {medias.length > 0 && games && games.length > 0 && <div className={styles.separator}/>}
    </>
}

const GameGrid = ({games, disableMediasSummary}) => {
    if (!games)
        return null;
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
                        {!disableMediasSummary && <MediasSummary game={game}/>}
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
                <span>podcast{nbPodcasts > 1 && "s"}</span>
                <span role="img" aria-label="Podcast" className={styles.emoji}>🎙️</span>
            </div>}
            {nbVideos > 0 &&
            <div className={styles.badge}>
                <span className={styles.number}>{nbVideos}</span>
                <span>vidéo{nbVideos > 1 && "s"}</span>
                <span role="img" aria-label="Vidéo" className={styles.emoji}>🎥</span>
            </div>
            }
        </div>
    </div>
};