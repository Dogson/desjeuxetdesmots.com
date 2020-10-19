import React from 'react';
import {connect} from "react-redux";
import styles from "./settings.module.scss"
import {FaCog, FaFilter} from "react-icons/fa";
import Popover from "react-popover";
import {Checkbox} from 'pretty-checkbox-react';
import '@djthoms/pretty-checkbox';
import cx from "classnames";
import {MEDIA_LOGOS, MEDIA_TYPES} from "../../config/const";
import {ACTIONS_SETTINGS} from "../../actions/settingsActions";
import {withGetScreen} from 'react-getscreen'
import {compose} from "redux";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            mediasFilter: {...this.props.settings.filters.medias},
            remember: this.props.settings.remember,
            shouldCheckAllVideos: true,
            shouldCheckAllPodcasts: true
        }


        this._handleTogglePopover = this._handleTogglePopover.bind(this);
        this._handleChangeMediasFilter = this._handleChangeMediasFilter.bind(this);
        this._handleChangeRemember = this._handleChangeRemember.bind(this);
        this._handleSaveSettings = this._handleSaveSettings.bind(this);
    }

    componentDidMount() {
        this.setState({
            shouldCheckAllVideos: this.getShouldCheckAll(this.state.mediasFilter, "video"),
            shouldCheckAllPodcasts: this.getShouldCheckAll(this.state.mediasFilter, "podcast")
        })
    }


    getShouldCheckAll(mediasFilter, type) {
        let shouldCheckAll = false;
        Object.keys(mediasFilter)
            .filter((mediaName) => {
                const media = MEDIA_LOGOS.find((media) => {
                    return media.name === mediaName;
                });
                return media.type === type
            }).forEach((media) => {
            if (!mediasFilter[media]) {
                shouldCheckAll = true;
            }
        });
        return shouldCheckAll;
    }

    _handleTogglePopover() {
        if (this.state.isOpen) {
            this.setState({settings: this.props.settings})
        }
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    _handleChangeMediasFilter(data, type) {
        const {mediasFilter} = {...this.state};
        const media = MEDIA_LOGOS.find((media) => {
            return media.name === data;
        });
        if (media.type === type) {
            mediasFilter[data] = !mediasFilter[data];

            if (type === "podcast") {
                this.setState({
                    mediasFilter,
                    shouldCheckAllPodcasts: this.getShouldCheckAll(mediasFilter, type)
                });
            } else {
                this.setState({
                    mediasFilter,
                    shouldCheckAllVideos: this.getShouldCheckAll(mediasFilter, type)
                });
            }
        }
    }

    _handleSelectAll(type) {
        const {mediasFilter} = {...this.state};

        const newMediasFilter = {...mediasFilter};
        Object.keys(mediasFilter).forEach((key) => {
            const media = MEDIA_LOGOS.find((media) => {
                return media.name === key;
            });
            if (media.type === type) {
                newMediasFilter[key] = type === "podcast" ? this.state.shouldCheckAllPodcasts : this.state.shouldCheckAllVideos;
            }
        })


        if (type === "podcast") {
            this.setState({
                mediasFilter: newMediasFilter,
                shouldCheckAllPodcasts: this.getShouldCheckAll(newMediasFilter, type)
            });
        } else {
            this.setState({
                mediasFilter: newMediasFilter,
                shouldCheckAllVideos: this.getShouldCheckAll(newMediasFilter, type)
            });
        }
    }

    _handleSaveSettings() {
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_FILTERED_VALUES,
            payload: {
                medias: this.state.mediasFilter,
            }
        })
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_REMEMBER,
            payload: this.state.remember
        })
        if (this.state.remember) {
            localStorage.setItem("filteredMedias", JSON.stringify(this.state.mediasFilter));
        }
        this.setState({isOpen: false})
    }

    _handleChangeRemember() {
        this.setState({remember: !this.state.remember});
    }

    renderMediaTypeFilters(mediaType) {
        const {mediasFilter} = this.state;
        const type = mediaType.dataLabel;
        const checkAll = type === "podcast" ? this.state.shouldCheckAllPodcasts : this.state.shouldCheckAllVideos;
        return <div className={styles.subBlock}>
            <div className={styles.subBlockTitle}>
                <Checkbox shape="curve" color="#FFC857"
                          checked={!checkAll}
                          onChange={() => this._handleSelectAll(type)}
                >
                    <span>{mediaType.name}</span>
                </Checkbox>
            </div>
            {
                MEDIA_LOGOS
                    .filter((mediaLogo) => {
                        return mediaLogo.type === type
                    })
                    .sort((x, y) => x.name < y.name ? -1 : 1)
                    .map(media =>
                        <div className={styles.filterRow}>
                            <Checkbox shape="curve"
                                      checked={mediasFilter[media.name]}
                                      onChange={() => this._handleChangeMediasFilter(media.name, type)}>
                                <span className={styles.filterName}>{media.name}</span>
                            </Checkbox>

                        </div>
                    )
            }
        </div>
    }

    renderPopoverContent() {
        const {remember} = this.state;
        return <div className={styles.settingsPopoverContainer}>
            <div className={styles.blockTitle}>
                <FaFilter className={styles.icon}/>
                <span>Filtres</span>
            </div>
            <div className={styles.settingsBlock}>
                {
                    MEDIA_TYPES.map((mediaType) => {
                        return this.renderMediaTypeFilters(mediaType)
                    })
                }

            </div>
            <div className={styles.settingsFooter}>
                <Checkbox shape="curve"
                          checked={remember}
                          onChange={this._handleChangeRemember}>
                    <span className={styles.longLabel}>Garder ces paramètres en mémoire à chaque visite</span>
                </Checkbox>
                <button className={styles.btn} onClick={this._handleSaveSettings}>Appliquer</button>
            </div>

        </div>
    }

    render() {
        const {isOpen} = this.state;
        return <div className={styles.settingsContainer}>
            <Popover
                isOpen={isOpen}
                onOuterAction={this._handleTogglePopover}
                place={this.props.isTablet() || this.props.isMobile() ? "below" : "left"}
                body={this.renderPopoverContent()}
            >
                <FaCog className={cx(styles.adminButton, isOpen && styles.active)}
                       onClick={this._handleTogglePopover}/>
            </Popover>

        </div>
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settingsReducer.settings
    }
};

export default compose(withGetScreen, connect(mapStateToProps))(Settings);