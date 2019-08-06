import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import firebase from '../../config/firebase';
import withFirebaseAuth, {WrappedComponentProps} from 'react-with-firebase-auth';

import PageLayout from "../../layouts/PageLayout";

import styles from "./admin.module.scss";
import {DebounceInput} from "react-debounce-input";

const firebaseAppAuth = firebase.auth();

const providers = {
    emailProvider: new firebase.auth.EmailAuthProvider()
};

class Admin extends Component {
    constructor(props) {
        super(props);


        this._handleChangeEmail = this._handleChangeEmail.bind(this);
        this._handleChangePassword = this._handleChangePassword.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);

        this.state = {
            fields: {
                email: "",
                password: ""
            },
            errorMessage: ""
        }
    }

    // HANDLING EVENTS

    _handleChangeEmail(email) {
        this.setState({fields: {...this.state.fields, email: email}, errorMessage: ""});
    }

    _handleChangePassword(password) {
        this.setState({fields: {...this.state.fields, password: password}, errorMessage: ""});
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (this.state.fields.email.length === 0 || this.state.fields.password.length === 0) {
            this.setState({errorMessage: "Veuillez remplir les champs ci-dessus"})
            return;
        }
        this.setState({errorMessage: ""});
        firebase.auth().signInWithEmailAndPassword(this.state.fields.email, this.state.fields.password)
            .catch((error) => {
                if (["auth/user-not-found", "auth/wrong-password"].indexOf(error.code) > -1) {
                    this.setState({errorMessage: "Les identifiants sont incorrects."})
                } else {
                    this.setState({errorMessage: "Une erreur est survenue lors de l'envoi du formulaire."})
                }
                console.log(error);
            });
    }

    renderLoggingForm() {
        return <form className={styles.formContainer} onSubmit={this._handleSubmit}>
            <div className={styles.titleContainer}>Panneau d'administration</div>
            <label>
                <span>email</span>
                <input type="email" value={this.state.email}
                       onChange={(e) => this._handleChangeEmail(e.target.value)}/>
            </label>
            <label>
                <span>password</span>
                <input type="password" value={this.state.password}
                       onChange={(e) => this._handleChangePassword(e.target.value)}/>
                <div className={styles.errorMessage}>{this.state.errorMessage}</div>
            </label>
            <button><input type="submit" value="se connecter"/></button>
        </form>;
    }

    renderAdminSection() {
        return <div>Hello Gwen !</div>;
    }

    render() {
        const {user} = this.props;

        return <PageLayout>
            <Helmet title="Panneau d'administration - gamer juice"/>
            {user ? this.renderAdminSection() : this.renderLoggingForm()}
        </PageLayout>
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth,
})(Admin);