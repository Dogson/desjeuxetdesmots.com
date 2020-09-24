import React from "react";
import styles from "./activeMediaBox.module.scss";
import * as moment from "moment";
import {DebounceInput} from "react-debounce-input";
import cx from "classnames";
import Loader from 'react-loader-spinner';
import {FaCheck, FaSave, FaSearch} from "react-icons/fa";
import {getGamesById, getGamesFromIGDB} from "../../endpoints/gamesEndpoint";
import ReactTooltip from "react-tooltip";
import {NavLink, withRouter} from "react-router-dom";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import {TrashWidget} from "../trashWidget/trashWidget";
import PlayPodcast from "../mediaPlayerWidgets/playPodcast";
import Truncate from 'react-truncate-markup';
import {connect} from "react-redux";

class ActiveMediaBox extends React.Component {
    constructor(props) {
        super(props);

        this._handleDeleteGame = this._handleDeleteGame.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleClickSuggestion = this._handleClickSuggestion.bind(this);
        this._handleOnSaveGames = this._handleOnSaveGames.bind(this);
        this._handleVerifyMedia = this._handleVerifyMedia.bind(this);
        this.state = {
            searchResults: [],
            episodeGames: this.props.media.games,
            showSaveBtn: false,
            loadingSuggestions: false,
            loadingSaveGames: false,
            noMatch: false,
            showFullDesc: false
        };
    }

    componentDidMount() {
        getGamesById(this.state.episodeGames).then((games) => {
            this.setState({episodeGames: games});
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.episodeGames.length !== this.state.episodeGames.length) {
            if (this.state.episodeGames.length !== this.props.media.games.length) {
                this.setState({showSaveBtn: true});
            } else {
                const episodeGamesIds = this.state.episodeGames.map((currentGame) => {
                    return currentGame.igdbId;
                }).sort();
                const gamesIds = this.props.media.games.map((game) => {
                    return game.igdbId;
                }).sort();
                let showSaveBtn = false;
                for (let i = 0; i < episodeGamesIds.length; i++) {
                    if (episodeGamesIds[i] !== gamesIds[i]) {
                        showSaveBtn = true;
                        break;
                    }
                }
                this.setState({showSaveBtn});
            }
        }
        if (prevProps.media._id !== this.props.media._id) {
            getGamesById(this.props.media.games.map(game => game._id)).then((games) => {
                this.setState({episodeGames: games});
            });
        }
        if (this.state.searchInput !== prevState.searchInput) {
            if (this.state.searchInput.length === 0) {
                this.setState({searchResults: []});
                return;
            }
            this.setState({loadingSuggestions: true});
            this.setState({noMatch: false});
            getGamesFromIGDB({search: this.state.searchInput, limit: 5})
                .then((result) => {
                    if (result.length === 0) {
                        this.setState({noMatch: true})
                    }
                    this.setState({searchResults: result, loadingSuggestions: false})
                })
        }
    }

    _handleDeleteGame(e, game) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.props.authUser)
            return;
        const episodeGames = this.state.episodeGames.filter((currentGame) => {
            return currentGame.igdbId !== game.igdbId;
        });
        this.setState({episodeGames});
    }

    _handleClickSuggestion(game) {
        const episodeGameIds = this.state.episodeGames.map((game) => game.igdbId);
        if (episodeGameIds.indexOf(game.igdbId) === -1) {
            const episodeGames = this.state.episodeGames.concat([game]);
            this.setState({episodeGames})
        }
    }

    _handleChange(value) {
        this.setState({searchInput: value});
    }

    _handleOnSaveGames() {
        if (this.state.loadingSaveGames || !this.props.authUser) {
            return;
        }
        this.setState({loadingSaveGames: true});
        return this.props.onSaveGames(this.state.episodeGames)
            .then(() => {
                this.setState({loadingSaveGames: false, showSaveBtn: false});
            })
    }

    _handleVerifyMedia() {
        if (this.state.loadingSaveGames || !this.props.authUser) {
            return;
        }
        this.setState({loadingSaveGames: true});
        return this.props.onVerifyMedia()
            .then(() => {
                this.setState({loadingSaveGames: false, showSaveBtn: false, verified: true});
            })
    }

    render() {
        const user = this.props.authUser;
        const episodeGames = user ? this.state.episodeGames : this.state.episodeGames.filter((epGame) => {
            return epGame._id !== this.props.currentGame._id;
        });
        const {media, hideDescription} = this.props;
        return <div className={styles.activeMediaBoxContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>
                    {media.name}
                </div>
                <div className={styles.date}>
                    {moment(media.releaseDate).format('DD/MM/YYYY')}
                </div>
            </div>
            <div className={styles.bodyContainer}>
                <div className={styles.leftRow}>
                    {!hideDescription && <div className={styles.description}>

                        {this.state.showFullDesc ?
                            <div>
                                {media.description.split("\n").map((i, key) => {
                                    return <div key={key}>{i}</div>;
                                })}
                                <button onClick={() => this.setState({
                                    showFullDesc: false
                                })}
                                        className={cx(styles.readMoreBtn)}>Voir moins
                                </button>
                            </div>
                            :
                            <Truncate lines={14} ellipsis={<span>... <button onClick={() => this.setState({
                                showFullDesc: true
                            })}
                                                                             className={cx(styles.readMoreBtn)}>Voir plus</button></span>}>
                                <div>
                                    {media.description.split("\n").map((i, key) => {
                                        return <div key={key}>{i}</div>;
                                    })}
                                </div>
                            </Truncate>
                        }
                    </div>}
                    }
                </div>
                <div className={styles.rightRow}>
                    <div className={styles.rightRowContainer}>
                        <div className={styles.mediaPlayerContainer}>
                            <PlayPodcast/>
                        </div>
                    </div>
                    <div className={styles.rightRowContainer}>

                        <h2>Ça parle de quoi d'autre ?</h2>

                        {this.state.showSaveBtn && user ?
                            <div className={styles.saveContainer} data-tip="Enregistrer les modifications">
                                <div onClick={this._handleOnSaveGames} data-tip="Enregistrer">
                                    {!this.state.loadingSaveGames ? <FaSave className={styles.icon}/> :
                                        <div style={{padding: '0 5px'}}><Loader
                                            type="TailSpin"
                                            color="#FFC857"
                                            height={15}
                                            width={15}
                                        /></div>}
                                </div>
                            </div> :
                            <div className={styles.verifyContainer}>
                                {media.verified || !user || this.state.verified ? null :
                                    <div onClick={this._handleVerifyMedia} data-tip="Marquer comme vérifié">
                                        {!this.state.loadingSaveGames ? <FaCheck className={styles.icon}/> :
                                            <Loader
                                                type="TailSpin"
                                                color="#FFC857"
                                                height={15}
                                                width={15}
                                            />}
                                    </div>
                                }
                            </div>

                        }
                        <ReactTooltip effect="solid" place="left"/>

                        {episodeGames.length > 0 ?
                            <div className={styles.gamesContainer}>
                                {episodeGames.map((game) => {
                                    return <div key={game._id}>
                                        <NavLink to={`/game/${game._id}`}>
                                            <GameCard
                                                showDelete={!!user} game={game} onDelete={this._handleDeleteGame}/>
                                        </NavLink>
                                    </div>

                                })
                                }
                            </div> :
                            <div className={styles.noGame}>Bah, de rien. C'est déja pas mal. <span role="img" aria-label="shrug">🤷</span></div>
                        }
                        {user && <div className={styles.inputWithSuggestionsContainer}>
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
                                {this.state.loadingSuggestions ?
                                    <div className={styles.loadingContainer}><LoadingSpinner size={30}/>
                                    </div> : this.state.searchResults.map((result) => {
                                        return <div className={cx(styles.suggestionItem, {
                                            [styles.active]: this.state.episodeGames.find((game) => {
                                                return game.igbdId === result.igbdId
                                            })
                                        })} key={result.igbdId}
                                                    onClick={() => this._handleClickSuggestion(result)}>
                                            {result.name} ({
                                            moment(result.releaseDate).format('YYYY') || "A venir"
                                        })
                                        </div>
                                    })}
                                {this.state.noMatch && <div className={styles.noMatch}>Aucun résultat</div>}
                            </div>
                        </div>}

                    </div>
                </div>
            </div>
        </div>
    }
}

const GameCard = ({game, showDelete, onDelete}) => {
    const gameNotLoaded = typeof game === "string";

    let style = {backgroundImage: `url(${game.cover})`};
    if (gameNotLoaded) {
        style = {backgroundColor: "#2E4052"}
    }

    return <div className={styles.cardContainer}>
        <div className={styles.backImage} style={style}/>
        <div className={styles.hoveredInfo}>
            <div className={styles.backColor}/>
            <div className={styles.title}>
                {game.name}
            </div>
            <div className={styles.secondaryInfoContainer}> &nbsp;</div>
            {showDelete && <div className={styles.footer}>
                <div onClick={(e) => {
                    onDelete(e, game)
                }} style={{height: '100%'}}>
                    <TrashWidget color="#FFC857"/>
                </div>
            </div>}
        </div>
    </div>
};

const mapStateToProps = state => {
    return {
        currentGame: state.gamesReducer.currentGame,
        authUser: state.usersReducer.authUser
    }
};

export default withRouter(connect(mapStateToProps)(ActiveMediaBox));