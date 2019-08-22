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
import {NavLink, Route, withRouter} from 'react-router-dom'
import queryString from "query-string/index";
import InfiniteScroll from 'react-infinite-scroller';
import * as moment from "moment/moment";

import logo from "../../assets/logos/gamerJuice/logo.png";
import logoCosyCorner from "../../assets/logos/cosyCorner/cosyCornerSmall.png";
import {MEDIA_TYPES} from "../../config/const";
import GamePage from "../game/GamePage";
import Admin from "../admin/Admin";


class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMoreGames: true
        };

        this._handleChange = this._handleChange.bind(this);
        this.getMoreGames = this.getMoreGames.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const nextValues = queryString.parse(nextProps.location.search);
        const currentValues = queryString.parse(this.props.location.search);
        if (nextValues.q !== currentValues.q) {
            this.setState({lastDoc: null});
            this.props.dispatch({type: ACTIONS_GAMES.SET_SEARCH_INPUT, payload: nextValues.q || ""});
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: []});
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

    getMoreGames() {
        const lastDoc = this.props.lastDoc;
        const search = this.props.searchInput;
        const previousGamesArray = this.props.games || [];
        getGamesBySearch({lastDoc, search}).then((result) => {
            this.setState({hasMoreGames: result.games.length > 0 && (!search || search.length === 0)});
            this.props.dispatch({
                type: ACTIONS_GAMES.SET_GAMES,
                payload: {games: previousGamesArray.concat(result.games), lastDoc: result.lastDoc}
            });
        });
    }


    //render functions

    renderGameGrid() {
        return <InfiniteScroll
            pageStart={0}
            loadMore={this.getMoreGames}
            hasMore={this.state.hasMoreGames}
            loader={<div className={styles.loaderContainer} key={0}><LoadingSpinner/></div>}
        >
            <GameGrid games={this.props.games}/>
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

const GameGrid = ({games}) => {
    if (!games)
        return null;
    if (games.length === 0) {
        return <div className={styles.noResultContainer}>
            <div><strong>Aucun jeu ne correspond à votre recherche.</strong></div>
            <div>Cela signifie probablement qu'aucun média n'a été encore publié à son sujet.</div>
        </div>
    }
    return <div className={styles.gamesGridContainer}>
        {
            games.map((game) => {
                return <div className={styles.cardContainer} key={game.id}>
                    <NavLink to= {`/game/${game.id}`}>
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
        {MEDIA_TYPES.map((mediaType) => {
            return mediaType.medias.map((media) => {
                if (game[media.dataLabel] && game[media.dataLabel].length > 0) {
                    return <div key={game.id}><img src={media.logoMin} alt={media.title}/></div>
                }
                return null;
            })
        })}
    </div>
};

const mapStateToProps = state => {
    return {
        games: state.gamesReducer.games,
        searchInput: state.gamesReducer.searchInput,
        lastDoc: state.gamesReducer.lastDoc
    }
};

export default withRouter(connect(mapStateToProps)(Homepage));