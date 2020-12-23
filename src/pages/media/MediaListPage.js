import React from "react";
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./mediaPage.module.scss";
import PageLayout from "../../layouts/PageLayout";
import {Helmet} from "react-helmet";
import cx from "classnames";
import {LoadingSpinner} from "../../components/loadingSpinner/loadingSpinner";
import {MEDIA_TYPES} from "../../config/const";
import {Logo} from "../../components/logo/logo";
import Dotdotdot from "react-dotdotdot";

class MediaListPage extends React.Component {

    render() {
        const {medias} = this.props;
        return <PageLayout notHomeHeader hideSettings noLogo>
            <Helmet defer={false}
                    title="Podcasts et vidéos - Des jeux et des mots"/>
            <div className={styles.mediaListPageContainer}>
                <NavLink className={styles.titleContainer} to={"/"}>
                    <div className={styles.logo}>
                        <Logo/>
                    </div>
                    <span className={styles.logoTitle}>Des jeux et des mots</span>
                </NavLink>
                <div className={styles.pageTitle}>Liste des podcasts et vidéastes</div>
                <div className={styles.info}>
                    <span>Il en manque ?</span>
                    <a className={cx(styles.btn, styles.small)}
                       href="https://twitter.com/humptydogson"
                       target="_blank" rel="noopener noreferrer">
                        Contactez-moi
                    </a>
                </div>
                <div className={styles.mediasList}>
                    {medias ?
                        medias.sort((a, b) => a.name < b.name ? -1 : 1).map((media, i) => {
                            const {emoji, creator} = MEDIA_TYPES.find(mediaType => mediaType.dataLabel === media.type);
                            const {name, logo, description} = media;
                            return <NavLink to={`/media/${name}`} key={i} className={styles.mediaItem}>
                                <div className={styles.mediaBlockLeft}>
                                    <img src={logo} alt={name} className={styles.mediaLogo}/>
                                </div>
                                <div className={styles.mediaBlockRight}>
                                    <div className={styles.mediaTitle}>
                                        <div className={styles.mediaName}>
                                            {name}
                                        </div>
                                        <div className={styles.mediaType}>
                                            {emoji} {creator}
                                        </div>
                                    </div>

                                    <div className={styles.mediaDescription}>
                                        <Dotdotdot clamp={6}>{description}</Dotdotdot>
                                    </div>
                                </div>
                            </NavLink>
                        }) :
                        <LoadingSpinner/>
                    }
                </div>
            </div>
        </PageLayout>
    }
}

const mapStateToProps = state => {
    return {
        medias: state.mediaReducer.medias,
    }
}

export default withRouter(connect(mapStateToProps)(MediaListPage));
