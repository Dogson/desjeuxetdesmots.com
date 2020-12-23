import React from 'react';
import {connect} from "react-redux";
import styles from "./settings.module.scss"
import {FaCog, FaFilter} from "react-icons/fa";
import Popover from "react-popover";
import {Checkbox} from 'pretty-checkbox-react';
import '@djthoms/pretty-checkbox';
import cx from "classnames";
import {MEDIA_TYPES} from "../../config/const";
import {ACTIONS_SETTINGS} from "../../actions/settingsActions";
import {isEqual} from "lodash";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            mediaTypesFilter: {...this.props.settings.filters.types},
        }

        this._handleTogglePopover = this._handleTogglePopover.bind(this);
        this._handleChangeMediasTypeFilter = this._handleChangeMediasTypeFilter.bind(this);
        this._handleSaveSettings = this._handleSaveSettings.bind(this);
    }

    componentDidUpdate(prevProps) {
       const prevFilters = {...prevProps.settings.filters};
       const filters = {...this.props.settings.filters};
        if (!isEqual(filters, prevFilters)) {
            this.setState({mediaTypesFilter: {...this.props.settings.filters.types}});
        }
    }

    _handleTogglePopover() {
        if (this.state.isOpen) {
            this.setState({settings: this.props.settings})
        }
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    _handleChangeMediasTypeFilter(type) {
        const {mediaTypesFilter} = {...this.state};
        mediaTypesFilter[type] = !mediaTypesFilter[type];
        this.setState({mediasFilterType: mediaTypesFilter});
    }

    _handleSaveSettings() {
        this.props.dispatch({
            type: ACTIONS_SETTINGS.SET_FILTERED_VALUES,
            payload: {
                types: this.state.mediasFilterType,
            }
        })
        this.setState({isOpen: false})
    }

    renderMediaTypeFilters(mediaType) {
        const {mediaTypesFilter} = this.state;
        const type = mediaType.dataLabel;
        return <div className={styles.subBlock} key={type}>
            <div className={styles.subBlockTitle}>
                <Checkbox shape="curve" color="#FFC857"
                          checked={mediaTypesFilter[type]}
                          onChange={() => this._handleChangeMediasTypeFilter(type)}>
                    <span><span role="img" aria-label={mediaType.name}>{mediaType.emoji}</span> {mediaType.name} </span>
                </Checkbox>
            </div>
        </div>
    }

    renderPopoverContent() {
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
                place={"below"}
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
        medias: state.mediaReducer.medias
    }
};

export default connect(mapStateToProps)(Settings);