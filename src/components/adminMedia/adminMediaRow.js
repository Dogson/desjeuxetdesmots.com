import React from "react";
import styles from "./adminMediaRow.module.scss";
import {getAllMedia, getNumberOfMedia, setGamesForMedia, toggleVerifyMedia} from "../../endpoints/mediasEndpoint";
import Carousel from "../carousel/carousel";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import ActiveMediaBox from "../activeMediaBox/activeMediaBox";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {MEDIA_TYPES} from "../../config/const";

class AdminMediaRow extends React.Component {
    constructor(props) {
        super(props);

        this._handleClickNext = this._handleClickNext.bind(this);
        this._handleClickMedia = this._handleClickMedia.bind(this);
        this._handleSaveGames = this._handleSaveGames.bind(this);
        this._handleVerifyMedia = this._handleVerifyMedia.bind(this);

        this.state = {
            medias: [],
            mediasWithEmpty: [],
            noMoreMedias: false,
            loading: false,
            totalCount: -1
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        this.setState({noMoreMedias: false});
        getNumberOfMedia({mediaDataLabel: this.props.type.dataLabel})
            .then(({count}) => {
                const medias = [];
                for (let i = 0; i < count; i++) {
                    medias.push(null);
                }
                this.setState({loading: false, totalCount: count, mediasWithEmpty: medias})
            });
        this.loadMoreMedias();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.medias !== prevState.medias) {
            const mediasListWithEmpty = Array.prototype.splice.apply(this.state.mediasWithEmpty, [0, this.state.medias.length].concat(this.state.medias));
            this.setState({mediasListWithEmpty})
        }
    }

    loadMoreMedias() {
        if (this.state.noMoreMedias) {
            return;
        }
        getAllMedia({mediaDataLabel: this.props.type.dataLabel, page: this.state.page})
            .then((result) => {
                if (result.medias.length > 0) {
                    const mediasList = this.state.medias.concat(result.medias);
                    this.setState({
                        medias: mediasList,
                        page: result.page,
                    });
                } else {
                    this.setState({noMoreMedias: true});
                }
            })
    }

    _handleClickNext() {
        this.loadMoreMedias();
    }

    _handleClickMedia(media) {

        this.props.dispatch({
            type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
            payload: {mediaType: this.props.type.dataLabel, media: media}
        });


    }

    _handleSaveGames(games) {
        return setGamesForMedia({
            games: games.map((game) => {
                const mappedGame = {...game};
                MEDIA_TYPES.forEach((mediaType) => {
                    mediaType.medias.forEach((media) => {
                        mappedGame[media.dataLabel] = null;
                    });
                    if (isNaN(mappedGame.releaseDate))
                        mappedGame.releaseDate = null;
                });
                return mappedGame;
            }),
            mediaType: this.props.mediaActive.mediaType,
            mediaId: this.props.mediaActive.media.id
        })
            .then(() => {
                this.setState({
                    medias: this.state.medias.map((media) => {
                        if (media.id === this.props.mediaActive.media.id) {
                            return {...media, games: games, isVerified: true};

                        }
                        return media;
                    })
                });
                this.props.dispatch({
                    type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
                    payload: {
                        mediaType: this.props.type.dataLabel,
                        media: {...this.props.mediaActive.media, games: games, isVerified: true}
                    }
                });
                return true;
            })
    }

    _handleVerifyMedia() {
        return toggleVerifyMedia({
            verified: true,
            mediaType: this.props.mediaActive.mediaType,
            mediaId: this.props.mediaActive.media.id
        })
            .then(() => {
                this.setState({
                    medias: this.state.medias.map((media) => {
                        if (media.id === this.props.mediaActive.media.id) {
                            return {...media, isVerified: true};

                        }
                        return media;
                    })
                });
                this.props.dispatch({
                    type: ACTIONS_MEDIAS.SET_ACTIVE_MEDIA,
                    payload: {
                        mediaType: this.props.type.dataLabel,
                        media: {...this.props.mediaActive.media, isVerified: true}
                    }
                });
                return true;
            })
    }

    renderActiveMedia() {
        const {mediaActive, type} = this.props;
        if (!mediaActive || mediaActive.mediaType !== type.dataLabel)
            return null;
        return <ActiveMediaBox media={mediaActive.media} onSaveGames={this._handleSaveGames}
                              onVerifyMedia={this._handleVerifyMedia} app={type.app} hideDescription={false}/>
    }

    render() {
        const {name, logoMin} = this.props.type;
        const {mediasWithEmpty} = this.state;
        const smallerCards = this.props.match.url === '/admin/videos';

        const activeItem = this.props.mediaActive && this.props.mediaActive.media;
        return <div className={styles.adminMediaRowContainer}>
            <div className={styles.title}>
                <img className={styles.imageContainer} src={logoMin} alt={name}/>
                {name}
            </div>
            {
                this.state.loading ? <LoadingSpinner/> : this.state.medias.length > 0 ?
                    <Carousel medias={mediasWithEmpty} onClickNext={this._handleClickNext}
                              onClickItem={this._handleClickMedia}
                              onScreenItems={6} activeItem={activeItem} smallerCards={smallerCards}
                    /> :
                    null
            }
            {this.renderActiveMedia()}
        </div>
    }
}

const mapStateToProps = state => {
    return {
        mediaActive: state.mediaReducer.mediaActive
    }
};

export default withRouter(connect(mapStateToProps)(AdminMediaRow));