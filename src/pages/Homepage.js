import React, {Component} from 'react';
import {DebounceInput} from 'react-debounce-input';
import cx from "classnames";
import styles from "./homepage.module.scss";
import logo from "../assets/images/logo.png";
import PageLayout from "../layouts/PageLayout";
import {getAllPopularGames, getGamesBySearch} from "../endpoints/gamesEndpoint";
import {connect} from "react-redux";
import {ACTIONS_GAMES} from "../actions/gamesActions";
import {FaSearch, FaGamepad} from "react-icons/fa";

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

    _handleChange(value) {
        this.setState({isLoading: true});
        this.props.dispatch({type: ACTIONS_GAMES.SET_SEARCH_INPUT, payload: value});
        this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: []});
        getGamesBySearch(value).then((result) => {
            console.log(value);
            this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: result});
            this.setState({isLoading: false})
        });
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
            <div className={styles.subtitle}>Soif de bons <strong>médias vidéoludiques ?</strong></div>
            <div className={styles.inputContainer}>
                <FaSearch className={styles.icon}/>
                <DebounceInput
                    className={styles.input}
                    minLength={2}
                    debounceTimeout={300}
                    onChange={(e) => this._handleChange(e.target.value)}
                    onKeyPress={this._handleKeyPress}
                    placeholder="Rechercher un jeu"/>
            </div>
            <GameGrid games={this.props.games}/>
            <Loading isLoading={this.state.isLoading}/>
        </PageLayout>
    }
}

const GameGrid = ({games}) => {
    if (!games)
        return null;
    return <div className={styles.gamesGridContainer}>
        {
            games.map((game) => {
                return <div className={styles.gameCardContainer} key={game.id}>
                    <img src={game.cover} alt={game.name}/>
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

export default connect(mapStateToProps)(Homepage);