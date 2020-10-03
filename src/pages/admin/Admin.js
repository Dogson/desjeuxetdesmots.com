import React, {Component} from 'react';
import {Helmet} from "react-helmet";

import PageLayout from "../../layouts/PageLayout";

import styles from "./admin.module.scss";
import {MEDIA_TYPES} from "../../config/const";
import {NavLink} from "react-router-dom";
import {login} from "../../endpoints/adminEndpoint";
import {connect} from "react-redux";
import {ACTIONS_USERS} from "../../actions/usersActions";

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
        return <form className={styles.formContainer} onSubmit={this._handleSubmit}>
            <label>
                <span>identifiant</span>
                <input type="text" value={this.state.username}
                       onChange={(e) => this._handlechangeUsername(e.target.value)}/>
            </label>
            <label>
                <span>mot de passe</span>
                <input type="password" value={this.state.password}
                       onChange={(e) => this._handleChangePassword(e.target.value)}/>
                <div className={styles.errorMessage}>{this.state.errorMessage}</div>
            </label>
            <button className={styles.btn}><input type="submit" value="se connecter"/></button>
        </form>;
    }

    renderAdminSection() {
        return <SectionGrid title="Medias" items={MEDIA_TYPES}/>;
    }

    render() {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        return <PageLayout title="Panneau d'administration">
            <Helmet title="Panneau d'administration - gamer juice"/>
            {token && username ? this.renderAdminSection() : this.renderLoggingForm()}
        </PageLayout>
    }
}

const SectionGrid = ({title, items}) => {
    return <div className={styles.sectionGridContainer}>
        <div className={styles.sectionTitle}>{title}</div>
        <div className={styles.sectionGrid}>
            {items.map((item) => {
                return <NavLink className={styles.cardContainer} key={item.name} to={item.route}>
                    <div className={styles.backImage} style={{backgroundImage: `url(${item.logo})`}}/>
                    <div className={styles.hoveredInfo}>
                        <div className={styles.backColor}/>
                        <div className={styles.title}>
                            {item.name}
                        </div>
                        <div className={styles.secondaryInfoContainer}>
                            {item.author}
                        </div>
                    </div>
                </NavLink>
            })}
        </div>
    </div>
};

const mapStateToProps = state => {
    return {
        authUser: state.usersReducer.authUser
    }
};

export default connect(mapStateToProps)(Admin);