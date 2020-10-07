import React from "react";
import {getAllMedia} from "../../endpoints/mediasEndpoint";
import MediaSection from "../mediaSection/mediaSection";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";
import styles from "./adminMediaSection.module.scss";
import {ACTIONS_MEDIAS} from "../../actions/mediaActions";
import {connect} from "react-redux";

class AdminMediaSection extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        getAllMedia(this.props.type)
            .then((medias) => {
                this.props.dispatch({
                    type: ACTIONS_MEDIAS.SET_MEDIAS_LIST,
                    payload: medias
                });
            })
    }


    render() {

        const {medias} = this.props;
        if (!medias) {
            return <LoadingSpinner/>
        }
        return <div>
            <MediaSection rowAttribute="name"/>
            {
                medias.length === 0 &&
                <div className={styles.noMedia}>
                    Tous les médias sont vérifiés ! <span role="img" aria-label="youpiii !"
                                                          className={styles.emoji}>🙌</span>
                </div>
            }
        </div>
    }
}

const mapStateToProps = state => {
    return {
        medias: state.mediaReducer.medias,
    }
};

export default connect(mapStateToProps)(AdminMediaSection);