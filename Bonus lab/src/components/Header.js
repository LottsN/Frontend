import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import localforage from 'localforage';
import { browserHistory } from 'react-router';
import '../styles/Header.css';
import logo from '../Content/HITS_Logo.png'

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: this.props.score,
            lives: this.props.lives,
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            // console.log("Got new Props in Info.js as ", newProps);
            this.setState({
                score: newProps.score,
                lives: 0,
            })
        }
    }

    render() {
        return (
            <div className="header">
                <img class="logo" src={logo}></img>
                <div class="HP">
                    HP: <span class="HP-counter"> {this.state.lives} </span>
                </div>
                <div class="Score">
                    Score: <span class="score-counter">{this.state.score}</span>
                </div>
            </div>
        );
    }
}