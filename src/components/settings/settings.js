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

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            mediasFilter: {...this.props.settings.filters.medias},
            typesFilter: {...this.props.settings.filters.types},
            remember: this.props.settings.remember,
            shouldCheckAllTypes: true,
            shouldCheckAllMedias: true
        }


        this._handleTogglePopover = this._handleTogglePopover.bind(this);
        this._handleChangeMediasFilter = this._handleChangeMediasFilter.bind(this);
        this._handleChangeTypesFilter = this._handleChangeTypesFilter.bind(this);
        this._handleChangeRemember = this._handleChangeRemember.bind(this);
        this._handleSaveSettings = this._handleSaveSettings.bind(this);
    }

    componentDidMount() {
        this.setState({
            shouldCheckAllTypes: this.getShouldCheckAllTypes(this.state.typesFilter),
            shouldCheckAllMedias: this.getShouldCheckAllMedias(this.state.mediasFilter)
        })
    }

    getShouldCheckAllTypes(typesFilter) {
        let shouldCheckAll = false;
        Object.keys(typesFilter).forEach((type) => {
            if (!typesFilter[type]) {
                shouldCheckAll = true;
            }
        })
        return shouldCheckAll;
    }

    getShouldCheckAllMedias(mediasFilter) {
        let shouldCheckAll = false;
        Object.keys(mediasFilter).forEach((media) => {
            if (!mediasFilter[media]) {
                shouldCheckAll = true;
            }
        })
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

    _handleChangeMediasFilter(data) {
        const {mediasFilter} = {...this.state};
        mediasFilter[data] = !mediasFilter[data];
        this.setState({
            mediasFilter,
            shouldCheckAllMedias: this.getShouldCheckAllMedias(mediasFilter)
        });
    }

    _handleChangeTypesFilter(data) {
        const {typesFilter} = {...this.state};
        typesFilter[data] = !typesFilter[data];
        this.setState({
            typesFilter,
            shouldCheckAllTypes: this.getShouldCheckAllTypes(typesFilter),
        });
    }

    _handleSelectAllType() {
        const {typesFilter} = {...this.state};

        const newTypesFilter = {};
        Object.keys(typesFilter).forEach((key) => {
            newTypesFilter[key] = this.state.shouldCheckAllTypes;
        })

        this.setState({
            typesFilter: newTypesFilter,
            shouldCheckAllTypes: this.getShouldCheckAllTypes(newTypesFilter)
        });
    }

    _handleSelectAllMedia() {
        const {mediasFilter} = {...this.state};

        const newMediasFilter = {};
        Object.keys(mediasFilter).forEach((key) => {
            newMediasFilter[key] = this.state.shouldCheckAllMedias;
        })

        this.setState({
            mediasFilter: newMediasFilter,
            shouldCheckAllMedias: this.getShouldCheckAllMedias(newMediasFilter)
        });
    }

    _handleSaveSettings() {
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_FILTERED_VALUES,
            payload: {
                medias: this.state.mediasFilter,
                types: this.state.typesFilter
            }
        })
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_REMEMBER,
            payload: this.state.remember
        })
        if (this.state.remember) {
            localStorage.setItem("filteredMedias", JSON.stringify(this.state.mediasFilter));
            localStorage.setItem("filteredTypes", JSON.stringify(this.state.typesFilter));
        }
        this.setState({isOpen: false})
    }

    _handleChangeRemember() {
        this.setState({remember: !this.state.remember});
    }

    renderPopoverContent() {
        const {mediasFilter, typesFilter, remember} = this.state;
        return <div className={styles.settingsPopoverContainer}>
            <div className={styles.blockTitle}>
                <FaFilter className={styles.icon}/>
                <span>Filtres</span>
            </div>
            <div className={styles.settingsBlock}>
                <div className={styles.subBlock}>
                    <div className={styles.subBlockTitle}>
                        <Checkbox shape="curve" color="#FFC857"
                                  checked={!this.state.shouldCheckAllTypes}
                                  onChange={() => this._handleSelectAllType()}
                        >
                            <span>Types de média</span>
                        </Checkbox>
                    </div>
                    {
                        MEDIA_TYPES.sort((x, y) => x.dataLabel < y.dataLabel ? -1 : 1).map(type =>
                            <div className={styles.filterRow}>
                                <Checkbox shape="curve" color="#FFC857"
                                          checked={typesFilter[type.dataLabel]}
                                          onChange={() => this._handleChangeTypesFilter(type.dataLabel)}
                                >
                                    <span className={styles.filterName}>{type.name}</span>
                                </Checkbox>

                            </div>
                        )
                    }
                </div>
                <div className={styles.subBlock}>
                    <div className={styles.subBlockTitle}>
                        <Checkbox shape="curve" color="#FFC857"
                                  checked={!this.state.shouldCheckAllMedias}
                                  onChange={() => this._handleSelectAllMedia()}
                        >
                            <span>Média</span>
                        </Checkbox>
                    </div>
                    {
                        MEDIA_LOGOS.sort((x, y) => x.name < y.name ? -1 : 1).map(media =>
                            <div className={styles.filterRow}>
                                <Checkbox shape="curve"
                                          checked={mediasFilter[media.name]}
                                          onChange={() => this._handleChangeMediasFilter(media.name)}>
                                    <span className={styles.filterName}>{media.name}</span>
                                </Checkbox>

                            </div>
                        )
                    }
                </div>


            </div>
            <div className={styles.settingsFooter}>
                <Checkbox shape="curve"
                          checked={remember}
                          onChange={this._handleChangeRemember}>
                    Garder ces paramètres en mémoire à chaque visite
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
                place="left"
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
        settings: state.settingsReducer.settings,
    }
};

export default connect(mapStateToProps)(Settings);