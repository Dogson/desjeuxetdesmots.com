import Sidebar from "react-sidebar";
import React from "react";
import styles from "./drawerMenuNav.module.scss";
import {FaArrowLeft, FaBars} from "react-icons/fa";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router-dom";
import {Logo} from "../logo/logo";
import cx from "classnames";

export class DrawerNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    render() {
        return <div className={styles.sidebarContainer}>
            <Sidebar
                sidebar={<MenuNavMobile routes={this.props.routes}
                                        onClose={() => this.onSetSidebarOpen(false)}/>}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                styles={{
                    sidebar: {
                        background: "#2E4052",
                        minHeight: "100vh",
                        width: "200px",
                        zIndex: 8
                    },
                    overlay: {
                        zIndex: 7,
                        backgroundColor: "rgba(0,0,0,.3)"
                    }
                }}
            >
                <div className={styles.sidebarButton} onClick={() => this.onSetSidebarOpen(true)}>
                    <FaBars className={styles.icon}/>
                </div>
            </Sidebar>
        </div>
    }
}

const MenuNavMobile = ({routes, onClose}) => {
    console.log(routes);
    return <div className={styles.menuNavMobile}>
        <div className={styles.menuHeader}>
            <div className={styles.backButton}>
                <FaArrowLeft onClick={onClose}/>
            </div>
            <div className={styles.logoImageContainer}>
                <Logo/>
            </div>
        </div>

        <div className={styles.navMenuMobileContainer}>
            {routes.map((route) => {
                return <MenuMobileLink route={route.path} name={route.name}/>
            })}
        </div>
    </div>
};

const PureMenuMobileLink = (props) => {
    const {route, name} = props;
    return <NavLink to={route}
                    exact
                    className={cx(styles.navMenuItem, styles.menuMobileLink)}
                    activeClassName={styles.active}>
        {name}
    </NavLink>
};

const MenuMobileLink = withRouter(PureMenuMobileLink);