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
import * as moment from "moment/moment";


class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreGames: true,
            loading: false
        };

        this._handleChange = this._handleChange.bind(this);
        this.getMoreGames = this.getMoreGames.bind(this);
    }

    componentDidMount() {
        this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: {page: 1}});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const nextValues = queryString.parse(nextProps.location.search);
        const currentValues = queryString.parse(this.props.location.search);
        if (nextValues.q !== currentValues.q) {
            this.setState({page: 1});
            this.props.dispatch({type: ACTIONS_GAMES.SET_SEARCH_INPUT, payload: nextValues.q || ""});
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: {games: [], page: 1}});
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.searchInput !== this.props.searchInput) {
            this.setState({hasMoreGames: true});
        }
    }

    _handleChange(value) {
        this.props.history.push(`/?q=${value}`);
    }

    async getMoreGames() {
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true});
        const page = this.props.page || 1;
        const search = this.props.searchInput;
        const previousGamesArray = this.props.games || [];
        const games = await getGamesBySearch({name: search, page});
        this.setState({hasMoreGames: games.length > 0 && (!search || search.length === 0)});
        this.props.dispatch({
            type: ACTIONS_GAMES.SET_GAMES,
            payload: {games: previousGamesArray.concat(games), page: page + 1}
        });
        this.setState({loading: false})
    }


    //render functions

    renderGameGrid() {
        return <InfiniteScroll
            loadMore={this.getMoreGames}
            hasMore={this.state.hasMoreGames}
            loader={<div className={styles.loaderContainer} key={0}><LoadingSpinner/></div>}
        >
            <GameGrid games={this.props.games} loading={this.state.loading}/>
        </InfiniteScroll>
    };

    render() {
        return <PageLayout>
            <Helmet>
                <title>{this.props.searchInput && this.props.searchInput.length > 0 ? `Recherche: ${this.props.searchInput}` : 'gamer juice for my gamer mouth'}</title>
            </Helmet>
            <div className={styles.subtitle}>Soif de bons médias vidéoludiques ?</div>
            <div className={cx(styles.inputContainer, {[styles.focus]: this.state.inputFocused})}>
                <FaSearch className={styles.icon}/>
                <DebounceInput
                    value={this.props.searchInput}
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
                return <div className={styles.cardContainer} key={game.id}>
                    <NavLink to={`/game/${game._id}`}>
                        <div className={styles.backImage} style={{backgroundImage: `url(${game.cover})`}}/>
                        <div className={styles.hoveredInfo}>
                            <div className={styles.backColor}/>
                            <div className={styles.title}>
                                {game.name}
                            </div>
                            <div className={styles.secondaryInfoContainer}>
                                {moment.isMoment(game.releaseDate) ? game.releaseDate.format('YYYY') : "A venir"}
                            </div>
                            <MediaLogos game={game}/>
                        </div>
                    </NavLink>
                </div>
            })
        }
    </div>
};

const MediaLogos = ({game}) => {
    return <div className={styles.mediasLogosContainer}>
        {
            game.medias.map((media) => {
                return <div key={media.name} className={styles.mediaLogo}>
                    <img src={media.logo} alt={media.name}/>
                </div>
            })
        }

    </div>
};

const mapStateToProps = state => {
    return {
        games: state.gamesReducer.games,
        searchInput: state.gamesReducer.searchInput,
        page: state.gamesReducer.page
    }
};

export default withRouter(connect(mapStateToProps)(Homepage));