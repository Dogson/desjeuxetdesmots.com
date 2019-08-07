import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import firebase from '../../config/firebase';
import withFirebaseAuth, {WrappedComponentProps} from 'react-with-firebase-auth';

import PageLayout from "../../layouts/PageLayout";

import styles from "./admin.module.scss";
import {DebounceInput} from "react-debounce-input";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import * as moment from "../homepage/Homepage";
import {NavLink, Redirect} from "react-router-dom";
import {AdminMediaSection} from "../../components/adminMediaSection/adminMediaSection";
import {MEDIAS} from "../../config/const";

const firebaseAppAuth = firebase.auth();

class PodcastsAdmin extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {user} = this.props;
        return <PageLayout title="Administration du Cosy Corner">
            <Helmet title="Panneau d'administration du Cosy Corner - gamer juice"/>
            {user === undefined ? <LoadingSpinner/> : user ? <AdminMediaSection type={MEDIAS.find((item) => {return item.name === "Podcasts"})}/> : <Redirect to="/admin"/>}
        </PageLayout>
    }
}

export default withFirebaseAuth({
    firebaseAppAuth,
})(PodcastsAdmin);