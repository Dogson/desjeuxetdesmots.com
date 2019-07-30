import React, {Component} from 'react';
import styles from "./homepage.module.scss";
import PageLayout from "../layouts/PageLayout";
import {getAllPopularGames} from "../endpoints/gamesEndpoint";
import {connect} from "react-redux";
import {ACTIONS_GAMES} from "../actions/gamesActions";

class Homepage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        if (!this.props.games || this.props.games.length <= 0) {
            getAllPopularGames().then((result) => {
                this.props.dispatch({type: ACTIONS_GAMES.SET_GAMES, payload: result});
                this.setState({isLoading: false})
            });

        }
    }

    render() {
        return <PageLayout>
            <GameGrid games={this.props.games}/>
        </PageLayout>
    }
}

const GameGrid = ({games}) => {
    console.log(games);
    if (!games)
        return null;
    return <div className={styles.gamesGridContainer}>
        {
            games.map((game) => {
                return <div className={styles.gameCardContainer} key={game.id}>
                    <img src={game.cover} alt={game.name} width={200} height={267} />
                </div>
            })
        }

    </div>
};

const mapStateToProps = state => {
    return {
        games: state.gamesReducer.games
    }
};

export default connect(mapStateToProps)(Homepage);