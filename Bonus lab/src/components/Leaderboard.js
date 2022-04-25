import React from 'react';
import { browserHistory } from 'react-router';
import Header from './Header';
import localforage from 'localforage';
import '../styles/Leaderboard.css';

export default class GameStart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            score: this.props.score,
            lives: this.props.lives,
            playersNames: this.props.playersNames,
            playersScores: this.props.playersScores,
        }
    }


    /*getPlayersNames(){
        let z = localforage.getItem('playersNames')
        .then((x) => {
            this.setState({playersNames: x});
            console.log('GETTED CURRENT NAMES', this.state.playersNames);
        })
    }

    getPlayersScores() {
        let z = localforage.getItem('playersScores')
        .then((x) => {
            this.state.playersScores = x;
            //console.log('GETTED CURRENT SCORES' , this.state.playersScores);
        })
    }*/

    getData(){
        let playersNames = [];
        let playersScores = []; 
        let first = localforage.getItem('playersNames')
        .then((a) => {
            this.setState({playersNames: a});
            let second = localforage.getItem('playersScores')
                .then((b) => {
                   this.setState({playersScores: b});
                   let third = localforage.getItem('playerName')
                   .then((c) => {
                       this.setState({name: c});
                       this.state.playersNames.push(c);
                       let fourth = localforage.getItem('ScoreAmount')
                       .then((d) => {
                            this.setState({score: d});
                            this.state.playersScores.push(d);

                            let namesCopy = this.state.playersNames;
                            let scoreCopy = this.state.playersScores;
                            let currentNameCopy = this.state.name;
                            let currentScoreCopy = this.state.score;

                            for (let i = 0; i < namesCopy.length; i++){
                                for (let k = i; k < namesCopy.length; k++){
                                    if ( parseInt(scoreCopy[i]) < parseInt(scoreCopy[k]) ){
                                        let tmp = scoreCopy[i];
                                        scoreCopy[i] = scoreCopy[k];
                                        scoreCopy[k] = tmp;
                                
                                        tmp = namesCopy[i];
                                        namesCopy[i] = namesCopy[k];
                                        namesCopy[k] = tmp;
                                    }
                                }
                            }

                            this.setState({
                                playersNames: namesCopy,
                                playersScores: scoreCopy,
                            })

                            localforage.setItem('playersScores', this.state.playersScores);
                            localforage.setItem('playersNames', this.state.playersNames);

                            /*console.log('afterall')
                            console.log(this.state.name);
                            console.log(this.state.score);
                            console.log(this.state.playersNames);
                            console.log(this.state.playersScores);*/

                       })
                   })
                })

        })
        
    }

    /*
    getScore() {
        let {playersScores} = this.state;
        let z = localforage.getItem('ScoreAmount')
        .then((x) =>{
            playersScores.push(x);
            this.setState({score: x, lives: 0, playersScores: playersScores});
            localforage.setItem('playersScores', this.state.playersScores);
            //console.log('GETTED CURRENT SCORE', this.state.score);
        });
    }

    getPreviousData(){
        let currentPlayersNames = setInterval(() => {
            if (!this.state.pause && this.state.score == undefined)
                this.getPlayersNames();
                currentPlayersNames = null;
        }, 10);

        let currentPlayersScores = setInterval(() => {
            if (!this.state.pause && this.state.score == undefined)
                this.getPlayersScores();
                currentPlayersScores = null;
        }, 10);
    }*/

    getCurrentData(){
        //let currentScore = setInterval(() => {
        //    if (!this.state.pause && this.state.score == undefined)
        //        this.getScore();
        //        currentScore = null;
        //}, 10);


        let currentName = setInterval(() => {
            if (!this.state.pause && this.state.name == undefined)
                this.getData();
                currentName = null;
        }, 10);
    }

    componentDidMount() {
        //this.getPreviousData();
        this.getCurrentData();
    }

    submit(e) {
        e.preventDefault();
        /*console.log(this.state.name);
        console.log(this.state.score);
        console.log(this.state.playersNames);
        console.log(this.state.playersScores);*/
        browserHistory.push("/");
    }


    render() {
        return (
            <div className="main">
                <Header score={this.state.score} lives={this.state.lives} />
                <div className="endgame">
                    
                    <p class="game-over">LEADERBOARD</p>

                    <div class="rankings-table">
                    <div className="line">
                        <div class="left-part">1. {this.state.playersNames == undefined ? '' : this.state.playersNames[0]}</div>
                        <div class="right-part">{this.state.playersScores == undefined ? '' : this.state.playersScores[0]} points</div>
                    </div>
                    <div className="line">
                        <div class="left-part">2. {this.state.playersNames == undefined ? '' : this.state.playersNames[1]}</div>
                        <div class="right-part">{this.state.playersScores == undefined ? '' : this.state.playersScores[1]} points</div>
                    </div>
                    <div className="line">
                        <div class="left-part">3. {this.state.playersNames == undefined ? '' : this.state.playersNames[2]}</div>
                        <div class="right-part">{this.state.playersScores == undefined ? '' : this.state.playersScores[2]} points</div>
                    </div>
                    <div className="line">
                        <div class="left-part">4. {this.state.playersNames == undefined ? '' : this.state.playersNames[3]}</div>
                        <div class="right-part">{this.state.playersScores == undefined ? '' : this.state.playersScores[3]} points</div>
                    </div>
                    <div className="line">
                        <div class="left-part">5. {this.state.playersNames == undefined ? '' : this.state.playersNames[4]}</div>
                        <div class="right-part">{this.state.playersScores == undefined ? '' : this.state.playersScores[4]} points</div>
                    </div>

                </div>
                    


                    <form onSubmit={this.submit.bind(this)}>
                            <button class="continue-button" label="Продолжить" onClick={this.submit.bind(this)}>Play again</button>
                    </form>

                </div>
                <div className="content">
                </div>
            </div>
        )
    }
}