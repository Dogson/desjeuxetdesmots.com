import Sidebar from "react-sidebar";
import React from "react";
import styles from "./drawerMenuNav.module.scss";
import {FaArrowLeft, FaBars} from "react-icons/fa";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router-dom";

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
                styles={{sidebar: {background: "#08090A", zIndex: 30, minHeight: "100vh", width: "100vw"}}}
            >
                <div className={styles.sidebarButton} onClick={() => this.onSetSidebarOpen(true)}>
                    <FaBars className={styles.icon}/>
                </div>
            </Sidebar>
        </div>
    }
}

const MenuNavMobile = ({routes, onClose}) => {
    return <div className={styles.menuNavMobile}>
        <div className={styles.backButton}><FaArrowLeft
            onClick={onClose}/><span>Menu</span></div>
        {routes.map((route) => {
            return  <MenuMobileLink route={route.path} name={route.name}/>
        })}
    </div>
};

const PureMenuMobileLink = (props) => {
    const {route, name} = props;
    return <NavLink to={route} className={styles.menuMobileLink}>
        {name}
    </NavLink>
};

const MenuMobileLink = withRouter(PureMenuMobileLink);