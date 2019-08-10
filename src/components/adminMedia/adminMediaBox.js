import React from "react";
import styles from "./adminMediaBox.module.scss";
import * as moment from "moment";
import {DebounceInput} from "react-debounce-input";
import cx from "classnames";
import PageLayout from "../../layouts/PageLayout";
import {FaSave, FaSearch} from "react-icons/fa";
import {getGamesFromIGDB} from "../../endpoints/gamesEndpoint";
import ReactTooltip from "react-tooltip";
import {NavLink} from "react-router-dom";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import {setGamesForMedia} from "../../endpoints/mediasEndpoint";

export class AdminMediaBox extends React.Component {
    constructor(props) {
        super(props);

        this._handleDeleteGame = this._handleDeleteGame.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleClickSuggestion = this._handleClickSuggestion.bind(this);
        this.state = {searchResults: [], currentGames: this.props.media.games, showSaveBtn: false, loading: false, noMatch: false}
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentGames.length !== this.state.currentGames.length) {
            debugger;
            if (this.state.currentGames.length !== this.props.media.games.length) {
                this.setState({showSaveBtn: true});
            } else {
                const currentGamesIds = this.state.currentGames.map((currentGame) => {
                    return currentGame.id;
                }).sort();
                const gamesIds = this.props.media.games.map((game) => {
                    return game.id;
                }).sort();
                let showSaveBtn = false;
                for (let i = 0; i < currentGamesIds.length; i++) {
                    if (currentGamesIds[i] !== gamesIds[i]) {
                        showSaveBtn = true;
                        break;
                    }
                }
                this.setState({showSaveBtn});
            }
        }
        if (prevProps.media.id !== this.props.media.id) {
            this.setState({currentGames: this.props.media.games, searchInput: "", showSaveBtn: false});
        }
        if (this.state.searchInput !== prevState.searchInput) {
            if (this.state.searchInput.length === 0) {
                this.setState({searchResults: []});
                return;
            }
            this.setState({loading: true});
            this.setState({noMatch: false});
            getGamesFromIGDB({search: this.state.searchInput, limit: 5})
                .then((result) => {
                    if (result.length === 0) {
                        this.setState({noMatch: true})
                    }
                    this.setState({searchResults: result, loading: false})
                })
        }
    }

    _handleDeleteGame(game) {
        const currentGames = this.state.currentGames.filter((currentGame) => {
            return currentGame.id !== game.id;
        });
        this.setState({currentGames});
    }

    _handleClickSuggestion(game) {
        if (!this.state.currentGames.find((currentGame) => {
            return game.id === currentGame.id
        })) {
            const currentGames = this.state.currentGames.concat([game]);
            this.setState({currentGames})
        }
    }

    _handleChange(value) {
        this.setState({searchInput: value});
    }

    render() {
        const {media} = this.props;

        return <div className={styles.adminMediaBoxContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {media.name}
                </div>
                <div className={styles.date}>
                    {media.releaseDate.format('DD/MM/YYYY')}
                </div>
            </div>
            <div className={styles.bodyContainer}>
                <div className={styles.leftRow}>
                    <div className={styles.description}>
                        {media.description}
                    </div>
                </div>
                <div className={styles.rightRow}>
                    <div className={styles.rightRowContainer}>
                        {this.state.showSaveBtn &&
                        <div className={styles.saveContainer} data-tip="Enregistrer les modifications">
                            <button onClick={() => this.props.onSaveGames(this.state.currentGames)} className={cx(styles.btn, styles.small)}><FaSave
                                className={styles.icon}/> sauvegarder les modifications
                            </button>
                        </div>}
                        <ReactTooltip effect="solid"/>
                        <div className={styles.gamesContainer}>
                            {this.state.currentGames.map((game) => {
                                return <div key={game.id} onClick={() => this._handleDeleteGame(game)}><GameCard
                                    game={game}/>
                                </div>
                            })}
                        </div>
                        <div className={styles.inputWithSuggestionsContainer}>
                            <div
                                className={cx(styles.inputContainer, styles.small, {[styles.focus]: this.state.inputFocused})}>
                                <FaSearch className={styles.icon}/>
                                <DebounceInput
                                    value={this.state.searchInput}
                                    className={styles.input}
                                    minLength={2}
                                    debounceTimeout={300}
                                    onChange={(e) => this._handleChange(e.target.value)}
                                    placeholder="Ajouter un jeu"
                                    onFocus={() => this.setState({inputFocused: true})}
                                    onBlur={() => this.setState({inputFocused: false})}/>
                            </div>
                            <div className={styles.suggestionsContainer}>
                                {this.state.loading ? <LoadingSpinner size={30}/> : this.state.searchResults.map((result) => {
                                    return <div className={cx(styles.suggestionItem, {[styles.active]: this.state.currentGames.find((game) => {return game.id === result.id})})} key={result.id}
                                                onClick={() => this._handleClickSuggestion(result)}>
                                        {result.name} ({
                                        moment.isMoment(result.releaseDate) ? result.releaseDate.format('YYYY') : "A venir"
                                    })
                                    </div>
                                })}
                                {this.state.noMatch && <div className={styles.noMatch}>Aucun résultat</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

const GameCard = ({game, onDelete}) => {
    return <div className={styles.cardContainer}>
        <div className={styles.backImage} style={{backgroundImage: `url(${game.cover})`}}/>
        <div className={styles.hoveredInfo}>
            <div className={styles.backColor}/>
            <div className={styles.title}>
                Remove
            </div>
        </div>
    </div>
}