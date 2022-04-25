import React from 'react';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import '../styles/GameStart.css';
import { orange, blue, amber } from '@material-ui/core/colors';
import '../styles/Info.css';
import Header from './Header';

const styles = {
    errorStyle: {
        color: orange,
    },
    underlineStyle: {
        borderColor: orange,
    },
    floatingLabelStyle: {
        color: amber,
    },
    floatingLabelFocusStyle: {
        color: blue,
    },
};

export default class GameStart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            lives: 0,
        }
    }
    submit(e) {
        e.preventDefault();
            browserHistory.push("/gameplay");
    }
    render() {
        return (
            <div className="main">
                <Header score={this.state.score} lives={this.state.lives}/>
                <form onSubmit={this.submit.bind(this)}>
                        <button className='start-button' label="Start" onClick={this.submit.bind(this)}>Start!</button>
                </form>
                <div className="content"></div>
            </div>
        )
    }
}