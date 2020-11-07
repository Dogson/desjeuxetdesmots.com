import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./mediaPage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {Helmet} from "react-helmet";

class MediaPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false
        };
    }

    componentDidMount() {
        const {currentMedia} = this.props;
    }

    render() {
        const {currentMedia} = this.props;

        return <PageLayout smallHeader>
            {currentMedia && currentMedia.name && <Helmet title={`${currentMedia.name} - Des jeux et des mots`}/>}

            <div className={styles.mediaPageContainer}>

            </div>
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        currentMedia: state.mediaReducer.currentMedia,
    }
}

export default withRouter(connect(mapStateToProps)(MediaPage));