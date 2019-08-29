import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import firebase from '../../config/firebase';
import withFirebaseAuth from 'react-with-firebase-auth';

import PageLayout from "../../layouts/PageLayout";

import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import {Redirect} from "react-router-dom";
import {AdminMediaSection} from "../../components/adminMedia/adminMediaSection";
import {MEDIA_TYPES} from "../../config/const";

const firebaseAppAuth = firebase.auth();

class VideosAdmin extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {user} = this.props;
        return <PageLayout title="Administration des vidéos">
            <Helmet title="Panneau d'administration des vidéos - gamer juice"/>
            {user === undefined ? <LoadingSpinner/> : user ? <AdminMediaSection type={MEDIA_TYPES.find((item) => {return item.name === "Vidéos"})}/> : <Redirect to="/admin"/>}
        </PageLayout>
    }
}

export default withFirebaseAuth({
    firebaseAppAuth,
})(VideosAdmin);