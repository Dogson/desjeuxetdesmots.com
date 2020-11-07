import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import styles from "./mediaPage.module.scss";

class MediaPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: {},
            loading: false,
            error: false
        };
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => {
    return {
        currentMedia: state.mediaReducer.currentMedia,
    }
}

export default withRouter(connect(mapStateToProps)(MediaPage));