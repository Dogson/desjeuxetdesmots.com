import React from "react"
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import styles from "./pageLayout.module.scss";
import Sidebar from "react-sidebar";
import {FaBars} from "react-icons/fa";
import {Link} from "react-router-dom";

export default ({children}) => (
    <div className={styles.pageContainer}>
        <DrawerNav/>
        <Header/>
        <div className={styles.pageContent}>
            {children}
        </div>
        <Footer/>
    </div>
)

class DrawerNav extends React.Component {
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
                touch={true}
                sidebar={<MenuNavMobile/>}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                styles={{sidebar: {background: "white", zIndex: 30, height: "100%"}}}
            >
                <div className={styles.sidebarButton} onClick={() => this.onSetSidebarOpen(true)}>
                    <FaBars className={styles.icon}/>
                </div>
            </Sidebar>
        </div>
    }
}

const MenuNavMobile = () => {
    return <div className={styles.menuNavMobile}>
        <MenuMobileLink route="/" name="Accueil"/>
        <MenuMobileLink route="/formations/" name="Formations"/>
    </div>
};

const MenuMobileLink = (props) => {
    const {route, name} = props;
    return <Link to={route} className={styles.menuMobileLink} activeClassName={styles.menuMobileLinkActive}
                 partiallyActive={route !== "/"}>
        {name}
    </Link>
};