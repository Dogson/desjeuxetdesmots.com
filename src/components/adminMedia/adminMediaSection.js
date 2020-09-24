import React from "react";
import {getAllMedia} from "../../endpoints/mediasEndpoint";
import MediaSection from "../mediaSection/mediaSection";
import {LoadingSpinner} from "../loadingSpinner/loadingSpinner";

export class AdminMediaSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            medias: null
        }
    }

    componentDidMount() {
        getAllMedia(this.props.type)
            .then((medias) => {
                this.setState({medias})
            })
    }


    render() {

        const {medias} = this.state;
        if (!medias) {
            return <LoadingSpinner/>
        }
        return <div>
            <MediaSection mediasList={medias} rowAttribute="name"/>
        </div>
    }
}