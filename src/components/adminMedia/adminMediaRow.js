import React from "react";
import styles from "./adminMediaRow.module.scss";
import {getAllMedia, getNumberOfMedia} from "../../endpoints/mediasEndpoint";
import Carousel from "../carousel/carousel";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import {AdminMediaBox} from "./adminMediaBox";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";

class AdminMediaRow extends React.Component {
    constructor(props) {
        super(props);

        this._handleClickNext = this._handleClickNext.bind(this);
        this._handleClickMedia = this._handleClickMedia.bind(this);

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

    loadMoreMedias() {
        if (this.state.noMoreMedias) {
            return;
        }
        getAllMedia({mediaDataLabel: this.props.type.dataLabel, lastDoc: this.state.lastDoc})
            .then((result) => {
                if (result.medias.length > 0) {
                    const mediasList = this.state.medias.concat(result.medias);
                    const mediasListWithEmpty = Array.prototype.splice.apply(this.state.mediasWithEmpty, [0, mediasList.length].concat(mediasList));
                    this.setState({
                        medias: mediasList,
                        lastDoc: result.lastDoc,
                        mediasListWithEmpty: mediasListWithEmpty
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

    renderActiveMedia() {
        const {mediaActive, type} = this.props;
        if (!mediaActive || mediaActive.mediaType !== type.dataLabel)
            return null;
        return <AdminMediaBox media={mediaActive.media}/>
    }

    render() {
        const {name, dataLabel, logoMin} = this.props.type;
        const {medias, mediasWithEmpty, lastDoc, totalCount} = this.state;
        const activeItem = this.props.mediaActive && this.props.mediaActive.media;
        return <div className={styles.adminMediaRowContainer}>
            <div className={styles.title}>
                <img className={styles.imageContainer} src={logoMin}/>
                {name}
            </div>
            {
                this.state.loading ? <LoadingSpinner/> : this.state.medias.length > 0 ?
                    <Carousel medias={mediasWithEmpty} onClickNext={this._handleClickNext}
                              onClickItem={this._handleClickMedia}
                              onScreenItems={6} activeItem={activeItem}/> :
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