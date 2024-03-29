import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import cx from "classnames";

import PageLayout from "../../layouts/PageLayout";

import styles from "./admin.module.scss";
import {login} from "../../endpoints/adminEndpoint";
import {connect} from "react-redux";
import {ACTIONS_USERS} from "../../actions/usersActions";
import AdminMediaSection from "../../components/adminMedia/adminMediaSection";

class Admin extends Component {
    constructor(props) {
        super(props);


        this._handlechangeUsername = this._handlechangeUsername.bind(this);
        this._handleChangePassword = this._handleChangePassword.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);

        this.state = {
            fields: {
                username: "",
                password: ""
            },
            errorMessage: ""
        };
    }

    // HANDLING EVENTS

    _handlechangeUsername(username) {
        this.setState({fields: {...this.state.fields, username: username}, errorMessage: ""});
    }

    _handleChangePassword(password) {
        this.setState({fields: {...this.state.fields, password: password}, errorMessage: ""});
    }

    _handleSubmit(e) {
        e.preventDefault();
        if (this.state.fields.username.length === 0 || this.state.fields.password.length === 0) {
            this.setState({errorMessage: "Veuillez remplir les champs ci-dessus"});
            return;
        }
        this.setState({errorMessage: ""});
        login(this.state.fields.username, this.state.fields.password)
            .then((user) => {
                this.props.dispatch({type: ACTIONS_USERS.SET_AUTHENTICATED_USER, payload: user});
            })
            .catch((err) => {
                if (err.response.data && err.response.data.error === "invalid_credentials") {
                    this.setState({errorMessage: "Les identifiants sont incorrects."})
                } else {
                    this.setState({errorMessage: "Une erreur est survenue lors de l'envoi du formulaire."})
                }
            });
    }

    renderLoggingForm() {
        return <form className={styles.Form} onSubmit={this._handleSubmit}>
            <label className={styles.Form_label}>
                <span className={styles.Form_labelContent}>identifiant</span>
                <input className={styles.InputText}
                       type="text" value={this.state.username}
                       onChange={(e) => this._handlechangeUsername(e.target.value)}/>
            </label>
            <label className={styles.Form_label}>
                <span className={styles.Form_labelContent}>mot de passe</span>
                <input className={styles.InputText}
                       type="password" value={this.state.password}
                       onChange={(e) => this._handleChangePassword(e.target.value)}/>
                <div className={styles.Form_error}>{this.state.errorMessage}</div>
            </label>
            <input className={cx(styles.Form_inputSubmit, styles.btn)} type="submit" value="Se connecter"/>
        </form>;
    }

    renderAdminSection() {
        return <div className={styles.adminPageContainer}><AdminMediaSection/></div>
    }

    render() {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        return <PageLayout title="Panneau d'administration">
            <Helmet defer={false} title="Panneau d'administration - Des jeux et des mots"/>
            {token && username ? this.renderAdminSection() : this.renderLoggingForm()}
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.usersReducer.authUser
    }
};

export default connect(mapStateToProps)(Admin);