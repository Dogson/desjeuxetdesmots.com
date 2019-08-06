import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import firebase from '../../config/firebase';
import withFirebaseAuth, {WrappedComponentProps} from 'react-with-firebase-auth';

import PageLayout from "../../layouts/PageLayout";

import styles from "./admin.module.scss";
import {DebounceInput} from "react-debounce-input";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import AdminMediaSection from "../../components/adminMediaSection/adminMediaSection";
import {PODCASTS} from "../../config/const";
import * as moment from "../homepage/Homepage";
import {NavLink, Redirect} from "react-router-dom";

const firebaseAppAuth = firebase.auth();

class CosyCornerAdmin extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {user} = this.props;
        return <PageLayout title="Administration du Cosy Corner">
            <Helmet title="Panneau d'administration du Cosy Corner - gamer juice"/>
            {user === undefined ? <LoadingSpinner/> : user ? <AdminMediaSection type={PODCASTS.find((item) => {return item.dataLabel === "cosyCorner"})}/> : <Redirect to="/admin"/>}
        </PageLayout>
    }
}

export default withFirebaseAuth({
    firebaseAppAuth,
})(CosyCornerAdmin);