import React from 'react';
import Dialog from 'material-ui/Dialog';
import '../styles/Info.css';
import logo from '../Content/HITS_Logo.png'

const message = (
    <div>
        <p> Нажмите ПРОБЕЛ для стрельбы </p>
        <p> Нажимте WASD/используйте мышь для перемещения коробля </p>
        <p> Нажимте ENTER для приостановки игры</p>
        <p> Нажмите ESC для закрытия этого окна </p>
        <p> Данные интрукции доступны по клику на иконку в левом вверхнем углу экрана </p>
    </div>
);

export default class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            score: this.props.score,
            lives: this.props.lives,
            pause: this.props.pause,
        }
    }

    componentWillReceiveProps(newProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(newProps)) {
            // console.log("Got new Props in Info.js as ", newProps);
            this.setState({
                score: newProps.score,
                lives: newProps.lives,
                pause: newProps.pause,
            })
        }
    }

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    showInfo() {
        this.setState({
            open: true,
        })
    }

    render() {
        return (
            <div>
                <div className="header">
                    <img class="logo" src={logo} onClick={this.showInfo.bind(this)} />
                    <div class="HP">
                         HP: <span class="HP-counter"> {this.state.lives} </span>
                    </div>
                    <div class="Score">
                        Score: <span class="score-counter">{this.state.score}</span>
                    </div>
                    <div>
                    {this.state.pause ? <div class='Pause'>Press ENTER to Play</div> : undefined}
                    </div>
                </div>
                <Dialog title="Управление" modal={false} open={this.state.open} onRequestClose={this.handleClose}>
                    {message}
                </Dialog>
            </div>
        )
    }
}