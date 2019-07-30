import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {DebounceInput} from 'react-debounce-input';
import cx from "classnames";
import styles from "./homepage.module.scss";
import logo from "../assets/images/logo.png";
import PageLayout from "../layouts/PageLayout";
import {getAllPopularGames, getGamesBySearch} from "../endpoints/gamesEndpoint";
import {connect} from "react-redux";
import {ACTIONS_GAMES} from "../actions/gamesActions";
import {FaSearch, FaGamepad} from "react-icons/fa";
import {withRouter} from 'react-router-dom'
import queryString from "query-string";


class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };

        this._handleChange = this._handleChange.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }

    componentDidMount() {
        if (!this.props.games || this.props.games.length <= 0) {
            this.setState({isLoading: true});
            getAllPopularGames().then((result) => {
                this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: result});
                this.setState({isLoading: false})
            });

        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const nextValues = queryString.parse(nextProps.location.search);
        const currentValues = queryString.parse(this.props.location.search);
        if (nextValues.q !== currentValues.q) {
            this.props.dispatch({type: ACTIONS_GAMES.SET_SEARCH_INPUT, payload: nextValues.q || ""});

            getGamesBySearch(nextValues.q).then((result) => {
                this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: result});
                this.setState({isLoading: false})
            });
        }
    }

    _handleChange(value) {
        this.setState({isLoading: true});
        this.props.history.push(`/?q=${value}`);
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            getGamesBySearch(this.props.searchInput).then((result) => {
                this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: result});
                this.setState({isLoading: false})
            });
        }
    }


    render() {
        return <PageLayout>
            <Helmet>
                <title>{this.props.searchInput && this.props.searchInput.length > 0 ? `Recherche: ${this.props.searchInput}` : 'gamer juice for my gamer mouth'}</title>
            </Helmet>
            <div className={styles.subtitle}>Soif de bons <strong>médias vidéoludiques ?</strong></div>
            <div className={cx(styles.inputContainer, {[styles.focus]: this.state.inputFocused})}>
                <FaSearch className={styles.icon}/>
                <DebounceInput
                    value={this.props.searchInput}
                    className={styles.input}
                    minLength={2}
                    debounceTimeout={300}
                    onChange={(e) => this._handleChange(e.target.value)}
                    onKeyPress={this._handleKeyPress}
                    placeholder="Rechercher un jeu"
                    onFocus={() => this.setState({inputFocused: true})}
                    onBlur={() => this.setState({inputFocused: false})}/>
            </div>
            <GameGrid games={this.props.games} isLoading={this.state.isLoading}/>
            <Loading isLoading={this.state.isLoading}/>
        </PageLayout>
    }
}

const GameGrid = ({games, isLoading}) => {
    if (!games || isLoading)
        return null;
    if (games.length === 0) {
        return <div className={styles.noResultContainer}>
            <div><strong>Aucun jeu ne correspond à votre recherche.</strong></div>
            <div>Une typo peut-être ?</div>
        </div>
    }
    return <div className={styles.gamesGridContainer}>
        {
            games.map((game) => {
                return <div className={cx(styles.flipCard, styles.gameCardContainer)} key={game.id}>
                    <div className={styles.flipCardInner}>
                        <div className={styles.flipCardFront}>
                            <img src={game.cover} alt={game.name}/>
                        </div>
                        <div className={styles.flipCardBack}>
                            <div className={styles.backColor}/>
                            <div className={styles.backImage} style={{backgroundImage: `url(${game.cover})`}}>
                            </div>
                            <div className={styles.title}>
                                {game.name}
                            </div>
                            <div className={styles.releaseDateContainer}>
                                {game.releaseDate}
                            </div>
                        </div>
                    </div>
                </div>
            })
        }

    </div>
};

const Loading = ({isLoading}) => {
    if (!isLoading) {
        return null;
    }
    return <div className={styles.loadingContainer}>
        <div className={styles.flipCard}>
            <div className={cx(styles.flipCardInner, styles.rotateVertCenter)}>
                <div className={styles.flipCardFront}>
                    <img src={logo} alt={"loading"} className={styles.icon}/>
                </div>
                <div className={styles.flipCardBack}>
                    <FaGamepad className={styles.icon}/>
                </div>
            </div>
        </div>
    </div>
};

const mapStateToProps = state => {
    return {
        games: state.gamesReducer.games,
        searchInput: state.gamesReducer.searchInput
    }
};

export default withRouter(connect(mapStateToProps)(Homepage));