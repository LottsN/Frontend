import React from 'react';
import { browserHistory } from 'react-router';
import '../styles/GameOver.css';
import '../styles/Info.css';
import Header from './Header';
import localforage from 'localforage';

export default class GameStart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            score: this.props.score,
            lives: this.props.lives,
        }
    }

    getScore() {
        let {score, lives} = this.state;
        let z = localforage.getItem('ScoreAmount')
        .then((x) =>{
            this.setState({score: x, lives: 0});
        });
    }


    fire(){
        let currentScore = setInterval(() => {
            if (!this.state.pause && this.state.score == undefined)
                this.getScore();
                currentScore = null;
        }, 10);
        
    }

    componentDidMount() {
        this.fire();
    }

    submit(e) {
        e.preventDefault();
        if (this.state.name != null && this.state.name != "") {
            localforage.setItem('playerName', this.state.name).then((value) => {
                //console.log("name: ", value);
                //console.log("score", this.state.score);
                browserHistory.push("/leaderboard")
            })
        } else {
            alert('Input correct name!')
        }
    }
    render() {
        return (
            <div className="main">
                <Header score={this.state.score} lives={this.state.lives} />
                <div className="endgame">
                    <p class="game-over">GAME OVER</p>
                    <p class="text">Congratulations! You scored <span class="score-counter-endgame">{this.state.score}</span> points and got to the leaderboard!</p>
                    <p class="text"> Type your name in to continue: </p>
                    <form onSubmit={this.submit.bind(this)}>
                            <input class="input-form" type="text" size="40" onChange={(event) => { this.setState({ name: event.target.value.trim() }) }}></input>
                            <button class="input-buttom" label="Продолжить" onClick={this.submit.bind(this)}>Continue</button>
                    </form>
                </div>
                <div className="content">
                </div>
            </div>
        )
    }
}