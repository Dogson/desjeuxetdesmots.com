import React from "react"
import styles from "./cookieConsent.module.scss"
import {connect} from "react-redux";
import {ACTIONS_SETTINGS} from "../../actions/settingsActions";
import GoogleAnalytics from "react-ga";
import {withRouter} from "react-router-dom";

class CookieConsent extends React.Component {
    constructor(props) {
        super(props);

        this._handleAcceptCookies = this._handleAcceptCookies.bind(this);
        this._handleKillCookies = this._handleKillCookies.bind(this);
    }

    _trackCurrentPage(page) {
        GoogleAnalytics.set({
            page
        });
        GoogleAnalytics.pageview(page);
    };

    _handleKillCookies() {
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_COOKIE_CONSENT,
            payload: "declined"
        });
    }

    _handleAcceptCookies() {
        GoogleAnalytics.initialize("UA-180553178-1");
        const page = this.props.location.pathname + this.props.location.search;
        this._trackCurrentPage(page);
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_COOKIE_CONSENT,
            payload: "accepted"
        });
    }

    render() {
        return <div className={styles.cookieConsentContainer}>
            <p>Bonjour, je cherche à améliorer l'expérience utilisateur du site internet. Pour cela, je récupère les
                données de navigation sur le site <strong>à des fins purement statistiques (aucun partage avec des annonceurs !).</strong></p>

            <p><strong>Vous pouvez évidemment décider de vous rétracter</strong> si vous ne souhaitez pas partager vos
                données de navigation sur ce site.</p>

            <div className={styles.cookieConsentFooter}>
                <button className={styles.btn} onClick={this._handleKillCookies}>Désactiver les données de navigation</button>
                <button className={styles.btn} onClick={this._handleAcceptCookies}>Accepter</button>
            </div>

        </div>
    }

}

export default withRouter(connect()(CookieConsent));