import React from "react"
import styles from "./header.module.scss"
import {NavLink, withRouter} from "react-router-dom";
import cx from "classnames";
import {Logo} from "../logo/logo";
import Settings from "../settings/settings";
import {FaSearch, FaArrowLeft} from "react-icons/fa";
import {DebounceInput} from "react-debounce-input";
import {getGamesAndMediasBySearch} from "../../endpoints/gamesEndpoint";
import Sidebar from "react-sidebar";
import {ACTIONS_SETTINGS} from "../../actions/settingsActions";
import {connect} from "react-redux";

class PureMobileDrawer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: false
        }

        this._handleSetSidebarOpen = this._handleSetSidebarOpen.bind(this);

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({sidebarOpen: false});
        }
        if (prevState.sidebarOpen !== this.state.sidebarOpen) {
            this._hideOrShowPageContent(this.state.sidebarOpen);
        }
    }

    _handleSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    _hideOrShowPageContent(mobileOpen) {
        const timeout = mobileOpen ? 300 : 0;
        window.setTimeout(() => {
            this.props.dispatch({
                type: ACTIONS_SETTINGS.IS_MOBILE_DRAWER_OPEN,
                payload: mobileOpen
            })
        }, timeout)
    }

    render() {
        return <div className={styles.mobileSearch}>
            <Sidebar
                touch={true}
                pullRight
                sidebar={
                    <div>
                        <div className={styles.backButton}><FaArrowLeft
                            onClick={() => this._handleSetSidebarOpen(false)}/><span>Recherche</span></div>
                        <HeaderSearchBar mobile onClickItem={() => this._handleSetSidebarOpen(false)}/>
                    </div>
                }
                open={this.state.sidebarOpen}
                onSetOpen={this._handleSetSidebarOpen}
                styles={{sidebar: {background: "#08090A", zIndex: 30, minHeight: "100vh", width: "100vw"}}}
            >
                <div className={styles.sidebarButton} onClick={() => this._handleSetSidebarOpen(true)}>
                    <FaSearch className={styles.icon}/>
                </div>
            </Sidebar>
        </div>
    }
}

export const MobileDrawer = withRouter(connect()(PureMobileDrawer));

export class Header extends React.Component {
    renderSettings() {
        if (this.props.hideSettings) {
            return null;
        }
        return <Settings/>
    }

    renderNavMenu() {
        return <div className={styles.navMenuContainer}>
            <NavLink to="/" exact className={styles.navMenuItem} activeClassName={styles.active}>
                Accueil
            </NavLink>
            <NavLink to="/media" className={styles.navMenuItem} activeClassName={styles.active}>
                Médias
            </NavLink>
            <NavLink to="/about" exact className={styles.navMenuItem}
                     activeClassName={styles.active}>
                A propos
            </NavLink>
        </div>
    }

    render() {
        const {notHomeHeader, noLogo} = this.props;
        return <div className={cx(styles.headerContainer, {[styles.notHomeHeader]: notHomeHeader})}>
            <div className={styles.headerWrapper}>
                {this.renderNavMenu()}
                {notHomeHeader && !noLogo &&
                <NavLink className={styles.titleContainer} to={"/"}>
                    <Logo/>
                </NavLink>
                }
                {notHomeHeader &&
                <>
                    <div className={styles.desktopSearch}>
                        <HeaderSearchBar/>
                    </div>
                </>
                }
            </div>
            {this.renderSettings()}
        </div>
    }

}

class PureHeaderSearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            previewSearchInput: "",
            inputFocused: false,
            searchResults: [],
            cursor: -1,
        }

        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleHover = this._handleHover.bind(this);
        this._handleBlur = this._handleBlur.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setState({cursor: -1, searchResults: [], previewSearchInput: ""});
        }
    }

    async _handleChange(search) {
        this.setState({previewSearchInput: search})
        try {
            const {games} = await getGamesAndMediasBySearch({name: search, limit: 5});
            this.setState({searchResults: games, cursor: -1})
        } catch (err) {
            this.setState({error: true})
        }
    }

    _handleBlur() {
        window.setTimeout(() => {
            this.setState({inputFocused: false})
        }, 100)
    }

    _handleKeyDown(e) {
        const {cursor, searchResults, previewSearchInput} = this.state
        // arrow up/down button should select next/previous list element
        if (e.keyCode === 38) {
            e.preventDefault();
            if (cursor > 0) {
                this.setState(prevState => ({
                    cursor: prevState.cursor - 1
                }))
            }
        } else if (e.keyCode === 40) {
            e.preventDefault();
            if (cursor < searchResults.length) {
                this.setState(prevState => ({
                    cursor: prevState.cursor + 1
                }))
            }
        } else if (e.keyCode === 13) {
            if (cursor < searchResults.length) {
                const game = searchResults[cursor];
                this.props.history.push({
                    pathname: `/game/${game._id}`,
                    game
                })
            } else {
                this.props.history.push(`/?q=${previewSearchInput}`)
            }
            e.target.blur();
            this.setState({cursor: -1, searchResults: [], previewSearchInput: ""});
        } else if (e.keyCode === 27) {
            e.target.blur();
            this.setState({cursor: -1});
        }
    }

    _handleHover(newCursor) {
        this.setState({cursor: newCursor})
    }

    render() {
        const {previewSearchInput, searchResults, cursor, inputFocused} = this.state;
        const {mobile} = this.props;

        return <div className={cx(styles.searchWithPreviewContainer, {[styles.mobile]: mobile})}>
            <div className={cx(styles.inputContainer, styles.small, {[styles.focus]: inputFocused})}>
                <FaSearch className={styles.icon}/>
                <DebounceInput
                    value={previewSearchInput}
                    className={cx(styles.input)}
                    minLength={1}
                    debounceTimeout={300}
                    onChange={(e) => this._handleChange(e.target.value)}
                    onKeyDown={this._handleKeyDown}
                    placeholder="Rechercher un jeu"
                    onFocus={() => this.setState({inputFocused: true})}
                    onBlur={this._handleBlur}/>
            </div>
            {
                (inputFocused || mobile) &&
                previewSearchInput.length > 0 &&
                <SearchPreviewResults results={searchResults} search={previewSearchInput}
                                      mobile={mobile}
                                      cursor={cursor} onHover={this._handleHover}/>}
        </div>
    }
}

const HeaderSearchBar = withRouter(PureHeaderSearchBar);

class SearchPreviewResults extends React.Component {
    render() {
        const {results, search, cursor, onHover, mobile} = this.props;

        return <div className={styles.searchResultsContainer}>
            <ul>
                {results.map((item, i) => {
                    return <li key={i} className={cx({[styles.active]: i === cursor})}
                               onMouseOver={() => onHover(i)}>
                        <NavLink to={{
                            pathname: `/game/${item._id}`,
                            game: item
                        }}
                                 className={styles.itemContainer}>
                            <div className={styles.imageContainer}>
                                <img src={item.cover} alt=""/>
                            </div>
                            <div className={styles.gameInfos}>
                                <div className={styles.gameTitle}>{item.name}</div>
                                <div className={styles.gameDate}>{item.formattedDate}</div>
                            </div>
                        </NavLink>
                    </li>
                })}
                <li className={cx(styles.allResults, {[styles.active]: cursor === results.length})}
                    onMouseOver={() => onHover(results.length)}>
                    <NavLink to={`/?q=${search}`}
                             className={cx({[styles.btn]: mobile})}>
                        <div className={styles.gameInfos}>
                            <div className={styles.gameTitle}> Tous les résultats
                                pour "{search}"
                            </div>
                        </div>
                    </NavLink>
                </li>
            </ul>
        </div>
    }
}