import React from 'react';
import {connect} from "react-redux";
import styles from "./settings.module.scss"
import {FaCog, FaFilter} from "react-icons/fa";
import Popover from "react-popover";
import {Checkbox} from 'pretty-checkbox-react';
import '@djthoms/pretty-checkbox';
import cx from "classnames";
import {MEDIA_LOGOS, MEDIA_TYPES} from "../../config/const";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            settings: this.props.settings
        }

        this._handleTogglePopover = this._handleTogglePopover.bind(this);
        this._handleChangeFilter = this._handleChangeFilter.bind(this);
        this._handleSaveSettings = this._handleSaveSettings.bind(this);

    }

    _handleTogglePopover() {
        if (this.state.isOpen) {
            this.setState({settings: this.props.settings})
        }
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    _handleChangeFilter(data, property) {
        const settings = {...this.state.settings};
        settings.filters[property][data] = !settings.filters[property][data];
        this.setState({settings});
    }

    _handleSaveSettings() {

    }


    renderPopoverContent() {
        const {settings} = this.state;
        return <div className={styles.settingsPopoverContainer}>
            <div className={styles.blockTitle}>
                <FaFilter className={styles.icon}/>
                <span>Filtres</span>
            </div>
            <div className={styles.settingsBlock}>
                <div className={styles.subBlock}>
                    <div className={styles.subBlockTitle}>
                        Types de média
                    </div>
                    {
                        MEDIA_TYPES.map(type =>
                            <div className={styles.filterRow}>
                                <Checkbox shape="curve" color="#FFC857"
                                          checked={settings.filters.types[type.dataLabel]}
                                          onChange={() => this._handleChangeFilter(type.dataLabel, "types")}
                                >
                                    <span className={styles.filterName}>{type.name}</span>
                                </Checkbox>

                            </div>
                        )
                    }
                </div>
                <div className={styles.subBlock}>
                    <div className={styles.subBlockTitle}>
                        Médias
                    </div>
                    {
                        MEDIA_LOGOS.map(media =>
                            <div className={styles.filterRow}>
                                <Checkbox shape="curve"
                                          checked={settings.filters.medias[media.name]}
                                          onChange={() => this._handleChangeFilter(media.name, "medias")}>
                                    <span className={styles.filterName}>{media.name}</span>
                                </Checkbox>

                            </div>
                        )
                    }
                </div>


            </div>
            <button className={styles.btn} onClick={this._handleSaveSettings}>Appliquer</button>
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