import React, {Component} from 'react';
import {Helmet} from "react-helmet";

import PageLayout from "../../layouts/PageLayout";

import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import {Redirect} from "react-router-dom";
import AdminMediaSection from "../../components/adminMedia/adminMediaSection";
import {connect} from "react-redux";
import styles from "./admin.module.scss";

class PodcastsAdmin extends Component {
    render() {
        const {authUser} = this.props;
        return <PageLayout title="Administration des videos">
            <Helmet title="Panneau d'administration des videos - Des jeux et des mots"/>
            {authUser === undefined ? <LoadingSpinner/> : authUser ?
                <div className={styles.adminPageContainer}><AdminMediaSection type="video"/></div> : <Redirect
                    to="/admin"/>}
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.usersReducer.authUser,
    }
};

export default connect(mapStateToProps)(PodcastsAdmin);