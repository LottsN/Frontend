import React from 'react';
import { browserHistory } from 'react-router';
import Snackbar from 'material-ui/Snackbar';
import localforage from 'localforage';
import Header from './Header';
import Info from './Info';
import '../styles/Main.css';
import Hero_Shot from '../Content/Shots/Hero_Shot.png';
import Hero_Ship from '../Content/Starships/Hero_Ship.png';
import Enemy_Ship_1 from '../Content/Starships/Enemy_Ship_1.png';
import Enemy_Ship_2 from '../Content/Starships/Enemy_Ship_2.png';
import Enemy_Ship_3 from '../Content/Starships/Enemy_Ship_3.png';
import Enemy_Ship_4 from '../Content/Starships/Enemy_Ship_4.png';
import Enemy_Shot_1 from '../Content/Shots/Enemy_Shot_1.png';
import Enemy_Shot_2 from '../Content/Shots/Enemy_Shot_2.png';
import Enemy_Shot_3 from '../Content/Shots/Enemy_Shot_3.png';
import Enemy_Shot_4 from '../Content/Shots/Enemy_Shot_4.png';
import Attack_Speed_Bonus from '../Content/Bonuses/Attack_Speed_Bonus.png';
import Enemy_Speed_Debuff_Bonus from '../Content/Bonuses/Enemy_Speed_Debuff_Bonus.png';
import Hero_Speed_Bonus from '../Content/Bonuses/Hero_Speed_Bonus.png';
import HP_Bonus from '../Content/Bonuses/HP_Bonus.png';
import Enemy_Explosion from '../Content/Explosions/explosion1.gif'


const bulletThrowInterval = 100;
const bulletSpeedInterval = 50;
const bonusSpeedInterval = 200;
const enemyThrowBulletInterval = 2000;
const bulletSpeedSize = 20;
const bonusSpeedSize = 5;
const enemiesThrowInterval = 1500;
const bonusThrowInterval = 30000;
const enemiesSpeedInterval = 200;
const enemiesSpeedSize = 10;
const numberOfBlasters = 3;

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pause: true,
            playerStyle: {
                left: 0,
                top: 0
            },
            bulletX: [],
            bulletY: [],
            bonusesX: [],
            bonusesY: [],
            unusedBonuses: [],
            bonusesTypes: [],
            bonusesImages: [
                Enemy_Speed_Debuff_Bonus,
                HP_Bonus,
                Hero_Speed_Bonus,
                Attack_Speed_Bonus,
            ],
            bonusesCount: 0,
            enemiesX: [],
            enemiesY: [],
            aliveEnemies: [],
            enemyTypes: [],
            enemyImages: [
                Enemy_Ship_1,
                Enemy_Ship_2,
                Enemy_Ship_3,
                Enemy_Ship_4
            ],
            enemyShotImages: [
                Enemy_Shot_1,
                Enemy_Shot_2,
                Enemy_Shot_3,
                Enemy_Shot_4
            ],
            enemiesBulletsFlyingDownX: [],
            enemiesBulletsFlyingDownY: [],
            enemiesBulletsFlyingLeftX: [],
            enemiesBulletsFlyingLeftY: [],
            enemiesBulletsFlyingRightX: [],
            enemiesBulletsFlyingRightY: [],
            enemiesBulletsFlyingDownTypes: [],
            enemiesBulletsFlyingLeftTypes: [],
            enemiesBulletsFlyingRightTypes: [],
            specialEnemiesBulletsX: [],
            specialEnemiesBulletsY: [],
            specialEnemiesBulletsTypes: [],
            specialBulletDifferenceX: [],
            specialBulletDifferenceY: [],
            enemyCount: 0,
            score: 0,
            lives: 100,
            explosionsX: [],
            explosionsY: [],
            enemyExplosionImage: [
                '',
                Enemy_Explosion
            ],
            explosionsStates: [],
            gameOver: false,
            snackBarOpen: false,
            numberOfBlasters,
            shipImage: Hero_Ship,
            playerName: null,
            enemyThrowIntervalSetter: this.doNothing()
        }
        this.selectSection = this.selectSection.bind(this)
    }


    selectSection (e) {
        console.log(e);
    }

    doNothing(){
    }

    componentDidMount() {
        this.fire();
        this.setState({
            bottom: this.getBoundaries().bottom - 120
        });
        this.refs.mainContainer.focus();
    }

    getBoundaries() {
        let rectCoordinates = this.refs.gameRegion.getBoundingClientRect();
        return rectCoordinates;
    }

    fire() {
        let {enemyThrowIntervalSetter} = this.state
        // setInterval(() => {
        //     if (!this.state.pause)
        //         this.generateBullet();
        // }, bulletThrowInterval);

        setInterval(() => {
            if (!this.state.pause)
                this.updatebulletY();
        }, bulletSpeedInterval);

        enemyThrowIntervalSetter = setInterval(() => {
            if (!this.state.pause)
                this.generateEnemies();
        }, enemiesThrowInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updateEnemiesY();
        }, enemiesSpeedInterval);

        setInterval(() => {
            if (!this.state.pause)
                this.generateEnemiesBulletsByType();
        }, enemyThrowBulletInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updatesEnemiesBulletsFlyingDown();
        }, bulletSpeedInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updatesEnemiesBulletsFlyingLeft();
        }, bulletSpeedInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updatesEnemiesBulletsFlyingRight();
        }, bulletSpeedInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updatesEnemiesSpecialBullets();
        }, bulletSpeedInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.generateBonuses();
        }, bonusThrowInterval)

        setInterval(() => {
            if (!this.state.pause)
                this.updateBonuses();
        }, bonusSpeedInterval)


    }

    generateBullet() {
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;
        //console.log(px, py)
        let { bulletX, bulletY } = this.state;
        bulletX.push(px + 10);
        bulletY.push(py - 35);
        this.setState({ bulletX, bulletY });
    }

    generateEnemiesBulletsByType(){
        let { aliveEnemies, enemyTypes, enemiesX, enemiesY } = this.state;
        for (let i = 0; i < aliveEnemies.length; i++) {
            if (aliveEnemies[i] === 1){
                if (enemyTypes[i] === 0){
                    this.generateBulletDown(enemiesX[i], enemiesY[i], enemyTypes[i])
                }
                if (enemyTypes[i] === 1){
                    this.generateBulletLeft(enemiesX[i], enemiesY[i], enemyTypes[i])
                    this.generateBulletRight(enemiesX[i], enemiesY[i], enemyTypes[i])
                }
                if (enemyTypes[i] === 2){
                    this.generateBulletLeft(enemiesX[i], enemiesY[i], enemyTypes[i])
                    this.generateBulletDown(enemiesX[i], enemiesY[i], enemyTypes[i])
                    this.generateBulletRight(enemiesX[i], enemiesY[i], enemyTypes[i])
                }
                if (enemyTypes[i] === 3){
                    this.generateBulletSpecial(enemiesX[i], enemiesY[i], enemyTypes[i]);
                }
            }
        }
    }


    calculateSpecialBulletsDifferences(enemyX, enemyY){
        let { specialBulletDifferenceX, specialBulletDifferenceY } = this.state;
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;
        let diffX = Math.round( (px - enemyX) / bulletSpeedSize );
        let diffY = Math.round( (py - enemyY) / bulletSpeedSize );
        if (diffX >= diffY){
            specialBulletDifferenceX.push( Math.round( (px - enemyX) / diffX ) );
            specialBulletDifferenceY.push( Math.round( (py - enemyY) / diffX ) );
        }
        else{
            specialBulletDifferenceX.push( Math.round( (px - enemyX) / diffY ) );
            specialBulletDifferenceY.push( Math.round( (py - enemyY) / diffY ) );
        }
        this.setState({ specialBulletDifferenceX, specialBulletDifferenceY })
    }

    generateBulletSpecial(enemyX, enemyY, type){
        let { specialEnemiesBulletsX, specialEnemiesBulletsY, specialEnemiesBulletsTypes } = this.state;
        specialEnemiesBulletsX.push(enemyX + 10);
        specialEnemiesBulletsY.push(enemyY + 35);
        specialEnemiesBulletsTypes.push(type);
        this.calculateSpecialBulletsDifferences(enemyX, enemyY)
        this.setState({ specialEnemiesBulletsX, specialEnemiesBulletsY, specialEnemiesBulletsTypes })
    }

    generateBulletRight(enemyX, enemyY, type){
        let { enemiesBulletsFlyingRightX, enemiesBulletsFlyingRightY, enemiesBulletsFlyingRightTypes } = this.state;
        enemiesBulletsFlyingRightX.push(enemyX + 10);
        enemiesBulletsFlyingRightY.push(enemyY + 35);
        enemiesBulletsFlyingRightTypes.push(type);
        this.setState({ enemiesBulletsFlyingRightX, enemiesBulletsFlyingRightY, enemiesBulletsFlyingRightTypes })
    }

    generateBulletRight(enemyX, enemyY, type){
        let { enemiesBulletsFlyingRightX, enemiesBulletsFlyingRightY, enemiesBulletsFlyingRightTypes } = this.state;
        enemiesBulletsFlyingRightX.push(enemyX + 10);
        enemiesBulletsFlyingRightY.push(enemyY + 35);
        enemiesBulletsFlyingRightTypes.push(type);
        this.setState({ enemiesBulletsFlyingRightX, enemiesBulletsFlyingRightY, enemiesBulletsFlyingRightTypes })
    }

    generateBulletLeft(enemyX, enemyY, type){
        let { enemiesBulletsFlyingLeftX, enemiesBulletsFlyingLeftY, enemiesBulletsFlyingLeftTypes } = this.state;
        enemiesBulletsFlyingLeftX.push(enemyX + 10);
        enemiesBulletsFlyingLeftY.push(enemyY + 35);
        enemiesBulletsFlyingLeftTypes.push(type);
        this.setState({ enemiesBulletsFlyingLeftX, enemiesBulletsFlyingLeftY, enemiesBulletsFlyingLeftTypes })
    }

    generateBulletDown(enemyX, enemyY, type){
        let {enemiesBulletsFlyingDownX, enemiesBulletsFlyingDownY, enemiesBulletsFlyingDownTypes} = this.state;
        enemiesBulletsFlyingDownX.push(enemyX + 10);
        enemiesBulletsFlyingDownY.push(enemyY + 35);
        enemiesBulletsFlyingDownTypes.push(type);
        this.setState({ enemiesBulletsFlyingDownX, enemiesBulletsFlyingDownY, enemiesBulletsFlyingDownTypes })
    }

    generateBonuses(){
        let { bonusesX, bonusesY, bonusesCount, unusedBonuses, bonusesTypes } = this.state;
        let width = Math.floor(this.getBoundaries().width);
        width = width - 540;
        bonusesX.push( Math.floor(Math.random() * width) + 1 );
        bonusesY.push(0);
        unusedBonuses.push(1);
        //bonusesTypes.push( Math.floor(Math.random() * 2) );
        bonusesTypes.push(1);
        bonusesCount++;
        this.setState({bonusesX, bonusesY, bonusesCount});
    }

    generateEnemies() {
        let { enemiesX, enemiesY, enemyCount, aliveEnemies, enemyTypes } = this.state;
        let width = Math.floor(this.getBoundaries().width);
        if (width > 800){
            width = width - 500;
        }
        enemiesX.push(Math.floor(Math.random() * width) + 1);
        enemiesY.push(0);
        aliveEnemies.push(1);
        let type =  Math.floor(Math.random() * 10);
        if (width < 800 ){
            type = 1;
        }
        if (0 <= type && type <= 3) enemyTypes.push(0);
        if (4 <= type && type <= 6) enemyTypes.push(1);
        if (7 <= type && type <= 8) enemyTypes.push(2);
        if (type == 9) enemyTypes.push(3);
        enemyCount++;
        this.setState({ enemiesX, enemiesY, enemyCount });
    }

    mouseMove(event) {
        if (!this.state.pause) {
            let { left, width, height, top } = this.getBoundaries();
            //console.log(this.getBoundaries())
            if (width > 800){
                width = width - 540;
            }
            height = height - 100;
            if (width <= 800) {
                height = height - 50;
            }
            let x = event.clientX - left;
            let y = event.clientY - top;
            let px = 0;
            let py = 0;

            if (x < width - 50){
                px = x;
            } else {
                px = width - 50;
            }
                
            if (y < height - 70){
                py = y
            } else {
                py = height - 70;
            }

            this.setState({
                playerStyle: { left: px, top: py }
            })
        }
    }

    updatesEnemiesSpecialBullets(){
        let {specialEnemiesBulletsX, specialEnemiesBulletsY, lives, specialBulletDifferenceX, specialBulletDifferenceY } = this.state;
        let {height, width} = this.getBoundaries();
        width = width - 490;
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;
        for (let i = 0; i < specialEnemiesBulletsY.length; i++){
            if (specialEnemiesBulletsY[i] + specialBulletDifferenceY[i] > 0 && specialEnemiesBulletsY[i] + specialBulletDifferenceY[i] < height - 70 && specialEnemiesBulletsY[i] > -bulletSpeedSize 
                && specialEnemiesBulletsX[i] + specialBulletDifferenceX[i] <= width && specialEnemiesBulletsX[i] + specialBulletDifferenceX[i] > 0){
                specialEnemiesBulletsY[i] = specialEnemiesBulletsY[i] + specialBulletDifferenceY[i];
                specialEnemiesBulletsX[i] = specialEnemiesBulletsX[i] + specialBulletDifferenceX[i];
                if (Math.abs(specialEnemiesBulletsX[i] - px) <= 40 && Math.abs(specialEnemiesBulletsY[i] - py) <= 70) {
                    //console.log("--------------------Spaceship Hit-----------------");
                    this.showShipBlast();
                    this.gamePause();
                    specialEnemiesBulletsY[i] = -bulletSpeedSize;
                    lives = lives - 10;
                    this.setState({
                        specialEnemiesBulletsY: specialEnemiesBulletsY,
                        specialEnemiesBulletsX : specialEnemiesBulletsX,
                        specialBulletDifferenceY: specialBulletDifferenceY,
                        specialBulletDifferenceX: specialBulletDifferenceX,
                        lives: lives,
                        snackBarOpen: true,
                    });
                    if (lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        this.setState({ specialEnemiesBulletsX, specialEnemiesBulletsY, specialBulletDifferenceX, specialBulletDifferenceY, lives });
    }

    updatesEnemiesBulletsFlyingRight(){
        let {enemiesBulletsFlyingRightX, enemiesBulletsFlyingRightY, lives} = this.state;
        let {height, width} = this.getBoundaries();
        width = width - 500;
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;

        for (let i = 0; i < enemiesBulletsFlyingRightY.length; i++){
            if (enemiesBulletsFlyingRightY[i] < height - 70 && enemiesBulletsFlyingRightY[i] > -bulletSpeedSize && enemiesBulletsFlyingRightX[i] <= width){
                enemiesBulletsFlyingRightY[i] = enemiesBulletsFlyingRightY[i] + bulletSpeedSize;
                enemiesBulletsFlyingRightX[i] = enemiesBulletsFlyingRightX[i] + bulletSpeedSize;
                if (Math.abs(enemiesBulletsFlyingRightX[i] - px) <= 40 && Math.abs(enemiesBulletsFlyingRightY[i] - py) <= 70) {
                    //console.log("--------------------Spaceship Hit-----------------");
                    this.showShipBlast();
                    this.gamePause();
                    enemiesBulletsFlyingRightY[i] = -bulletSpeedSize;
                    lives = lives - 10;
                    this.setState({
                        enemiesBulletsFlyingRightY: enemiesBulletsFlyingRightY,
                        enemiesBulletsFlyingRightX : enemiesBulletsFlyingRightX,
                        lives: lives,
                        snackBarOpen: true,
                    });
                    if (lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        this.setState({ enemiesBulletsFlyingRightX, enemiesBulletsFlyingRightY, lives });
    }

    updatesEnemiesBulletsFlyingLeft(){
        let {enemiesBulletsFlyingLeftX, enemiesBulletsFlyingLeftY, lives} = this.state;
        let {height, width} = this.getBoundaries();
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;

        for (let i = 0; i < enemiesBulletsFlyingLeftY.length; i++){
            if (enemiesBulletsFlyingLeftY[i] < height - 70 && enemiesBulletsFlyingLeftY[i] > -bulletSpeedSize && enemiesBulletsFlyingLeftX[i] - bulletSpeedSize >= 0){
                enemiesBulletsFlyingLeftY[i] = enemiesBulletsFlyingLeftY[i] + bulletSpeedSize;
                enemiesBulletsFlyingLeftX[i] = enemiesBulletsFlyingLeftX[i] - bulletSpeedSize;
                if (Math.abs(enemiesBulletsFlyingLeftX[i] - px) <= 40 && Math.abs(enemiesBulletsFlyingLeftY[i] - py) <= 70) {
                    //console.log("--------------------Spaceship Hit-----------------");
                    this.showShipBlast();
                    this.gamePause();
                    enemiesBulletsFlyingLeftY[i] = -bulletSpeedSize;
                    lives = lives - 10;
                    this.setState({
                        enemiesBulletsFlyingLeftY: enemiesBulletsFlyingLeftY,
                        enemiesBulletsFlyingLeftX : enemiesBulletsFlyingLeftX,
                        lives: lives,
                        snackBarOpen: true,
                    });
                    if (lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        this.setState({ enemiesBulletsFlyingLeftX, enemiesBulletsFlyingLeftY, lives });
    }

    updateBonuses(){
        let { bonusesX, bonusesY, lives, bonusesTypes, unusedBonuses, enemyThrowIntervalSetter, score } = this.state;
        let { height } = this.getBoundaries();
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;

        for (let i = 0; i < bonusesY.length; i++){
            if (bonusesY[i] < height - 70 && bonusesY[i] > -bonusSpeedSize){
                bonusesY[i] = bonusesY[i] + bonusSpeedSize;
                if (Math.abs(bonusesX[i] - px) <= 60 && Math.abs(bonusesY[i] - py) <= 60 && unusedBonuses[i] === 1) {
                    //console.log("--------------------Use bonus-----------------");
                    if (bonusesTypes[i] === 0){
                        bonusesY[i] = -bonusSpeedSize;
                        unusedBonuses[i] = 0;
                        let enemiesThrowIntervalCopy = enemiesThrowInterval + ( Math.round( score / 10 ) * 250 );
                            if (enemiesThrowIntervalCopy > 10000){
                                enemiesThrowIntervalCopy = 10000;
                            }
                            enemyThrowIntervalSetter = setInterval(() => {
                                if (!this.state.pause)
                                    this.generateEnemies();
                            }, enemiesThrowIntervalCopy)
                    }
                    if (bonusesTypes[i] === 1){
                        if (lives != 100){
                            lives = lives + 30
                            if (lives > 100){
                                lives = 100;
                            }
                        bonusesY[i] = -bonusSpeedSize;
                        unusedBonuses[i] = 0;
                        }
                    }
                    if (bonusesTypes[i] === 2){
                        //3
                    }
                    if (bonusesTypes[i] === 3){
                    }
                    this.setState({
                        bonusesY: bonusesY,
                        lives: lives,
                    });
                }
            }
        }
    }

    updatesEnemiesBulletsFlyingDown(){
        let {enemiesBulletsFlyingDownX, enemiesBulletsFlyingDownY, lives} = this.state;
        let {height} = this.getBoundaries();
        let px = this.state.playerStyle.left;
        let py = this.state.playerStyle.top;

        for (let i = 0; i < enemiesBulletsFlyingDownY.length; i++){
            if (enemiesBulletsFlyingDownY[i] < height - 70 && enemiesBulletsFlyingDownY[i] > -bulletSpeedSize){
                enemiesBulletsFlyingDownY[i] = enemiesBulletsFlyingDownY[i] + bulletSpeedSize;
                if (Math.abs(enemiesBulletsFlyingDownX[i] - px) <= 40 && Math.abs(enemiesBulletsFlyingDownY[i] - py) <= 70) {
                    //console.log("--------------------Spaceship Hit-----------------");
                    this.showShipBlast();
                    this.gamePause();
                    enemiesBulletsFlyingDownY[i] = -bulletSpeedSize;
                    lives = lives - 10;
                    this.setState({
                        enemiesBulletsFlyingDownY: enemiesBulletsFlyingDownY,
                        lives: lives,
                        snackBarOpen: true,
                    });
                    if (lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        this.setState({ enemiesBulletsFlyingDownX, enemiesBulletsFlyingDownY, lives });
    }


    /*showEnemyShipBlast(blast = true, enemyX, enemyY, index) {
        if (blast) {
            setTimeout(() => {
                this.showEnemyShipBlast(false);
            }, 1500)
        }

    }*/



    updatebulletY() {
        let { bulletY, bulletX, enemiesX, enemiesY, enemyCount, aliveEnemies, score, enemyThrowIntervalSetter, enemiesThrowInterval } = this.state;
        for (let i = 0; i < bulletY.length; i++) {
            if (bulletY[i] > -bulletSpeedSize) {
                bulletY[i] = bulletY[i] - bulletSpeedSize;
                let bx = bulletX[i];
                let by = bulletY[i];
                for (let j = 0; j < enemiesX.length; j++) {
                    let ex = enemiesX[j];
                    let ey = enemiesY[j];
                    if (aliveEnemies[j] === 1 && (bx >= ex) && (bx - ex) <= 60 && Math.abs(by - ey) <= 60) {
                        this.state.explosionsX.push(enemiesX[j]);
                        this.state.explosionsY.push(enemiesY[j])
                        this.state.explosionsStates.push(1);
                        bulletY[i] = -bulletSpeedSize;
                        enemiesY[j] = this.state.bottom + enemiesSpeedSize;
                        aliveEnemies[j] = 0;
                        // console.log(`Enemy ${i} dying`);
                        enemyCount--;
                        score++;
                        //if (score % 2 === 0){
                          //  clearInterval(enemyThrowIntervalSetter);
                          //  let enemiesThrowIntervalCopy = enemiesThrowInterval + 5000;
                          //  if (enemiesThrowIntervalCopy < 500){
                           //     enemiesThrowIntervalCopy = 5000;
                          //  }
                           // enemyThrowIntervalSetter = setInterval(() => {
                            //    if (!this.state.pause)
                            //        this.generateEnemies();
                            //}, enemiesThrowIntervalCopy)
                        //}
                    }
                }
            }
        }
        this.setState({ bulletY, enemiesY, enemyCount, score, aliveEnemies });
    }

    updateEnemiesY() {
        let { enemiesY, enemiesX, playerStyle, aliveEnemies, lives, enemyCount } = this.state;
        let {height} = this.getBoundaries();
        for (let i = 0; i < enemiesY.length; i++) {
            if (enemiesY[i] > -enemiesSpeedSize) {
                enemiesY[i] = enemiesY[i] + enemiesSpeedSize;
                // Check if it collides with spaceship
                let ex = enemiesX[i];
                let ey = enemiesY[i];
                let px = playerStyle.left;
                let py = playerStyle.top;
                if (Math.abs(ex - px) <= 40 && Math.abs(ey - py) <= 40 && aliveEnemies[i] == 1) {
                    //console.log("--------------------Spaceship Hit-----------------");
                    this.showShipBlast();
                    this.gamePause();
                    lives = lives - 50;
                    aliveEnemies[i] = 0;
                    enemyCount--;
                    this.setState({
                        aliveEnemies,
                        lives: lives,
                        snackBarOpen: true,
                    });
                    if (lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
        this.setState({ enemiesY, enemiesX });
    }

    createExplosion(index, left, top) {
        let { enemyExplosionImage, explosionsStates } = this.state
        return (
            <div key={`explosions_${index}`} className={`alert alert-success ${explosionsStates[index] == 0 ? 'alert-shown' : 'alert-hidden'}`}
            onTransitionEnd={() => explosionsStates[index] = 0}  style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={enemyExplosionImage[1]} alt="b" />
            </div>
        )
    }

    createBonus(index, left, top) {
        let { bonusesTypes, bonusesImages } = this.state
        return (
            <div key={`bonus_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={bonusesImages[bonusesTypes[index]]} alt="b" />
            </div>
        )
    }

    createBullet(index, left, top) {
        return (
            <div key={`bullet_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={Hero_Shot} alt="b" />
            </div>
        )
    }


    createEnemyDownBullet(index, left, top){
        let {enemiesBulletsFlyingDownTypes, enemyShotImages} = this.state;
        return (
            <div key={`enemyDownBullet_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={enemyShotImages[enemiesBulletsFlyingDownTypes[index]]} alt="b" />
            </div>
        )
    }

    createEnemyLeftBullet(index, left, top){
        let {enemiesBulletsFlyingLeftTypes, enemyShotImages} = this.state;
        return (
            <div key={`enemyLeftBullet_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={enemyShotImages[enemiesBulletsFlyingLeftTypes[index]]} alt="b" />
            </div>
        )
    }

    createEnemyRightBullet(index, left, top){
        let {enemiesBulletsFlyingRightTypes, enemyShotImages} = this.state;
        return (
            <div key={`enemyRightBullet_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={enemyShotImages[enemiesBulletsFlyingRightTypes[index]]} alt="b" />
            </div>
        )
    }

    createEnemySpecialBullet(index, left, top){
        let {specialEnemiesBulletsTypes, enemyShotImages} = this.state;
        return (
            <div key={`enemyRightBullet_${index}`} style={{ position: 'absolute', left, top, alignContent: 'center' }} >
                <img src={enemyShotImages[specialEnemiesBulletsTypes[index]]} alt="b" />
            </div>
        )
    }

    returnUndefined(){
        console.log('reorweiorwerfeji')
        return undefined;
    }

    renderExplosions(){
        let {explosionsStates} = this.state;
        setTimeout( () => {
            return this.state.explosionsX.map((value, index, array) => {
                //console.log(index)
                let top = ((this.state.explosionsY[index]) + "px").toString();
                let left = ((this.state.explosionsX[index]) + "px").toString();
                let explosionYIndex = this.state.explosionsY[index];
                if (explosionYIndex > 0 && explosionYIndex < 850) {
                    console.log(explosionsStates[index]);
                    return this.createExplosion(index, left, top);
                } else {
                    return undefined
                }
            }, this);
        }, 10000)
    }

    renderBonuses(){
        return this.state.bonusesX.map((value, index, array) => {
            //console.log(index)
            let top = ((this.state.bonusesY[index] + 40) + "px").toString();
            let left = ((this.state.bonusesX[index]) + "px").toString();
            let bulletYIndex = this.state.bonusesY[index];
            if (bulletYIndex > 0 && bulletYIndex < 850) {
                return this.createBonus(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }

    renderEnemiesBulletFlyingDown(){
        return this.state.enemiesBulletsFlyingDownX.map((value, index, array) => {
            //console.log(index)
            let top = ((this.state.enemiesBulletsFlyingDownY[index] + 40) + "px").toString();
            let left = ((this.state.enemiesBulletsFlyingDownX[index]) + "px").toString();
            let bulletYIndex = this.state.enemiesBulletsFlyingDownY[index];
            if (bulletYIndex > 0 && bulletYIndex < 880) {
                return this.createEnemyDownBullet(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }

    renderEnemiesBulletFlyingLeft(){
        return this.state.enemiesBulletsFlyingLeftX.map((value, index, array) => {
            //console.log(index)
            let top = ((this.state.enemiesBulletsFlyingLeftY[index] + 40) + "px").toString();
            let left = ((this.state.enemiesBulletsFlyingLeftX[index]) + "px").toString();
            let bulletYIndex = this.state.enemiesBulletsFlyingLeftY[index];
            let bulletXIndex = this.state.enemiesBulletsFlyingLeftX[index]
            if (bulletYIndex > 0 && bulletYIndex < 880 && bulletXIndex > 20) {
                return this.createEnemyLeftBullet(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }

    renderEnemiesBulletFlyingRight(){
        return this.state.enemiesBulletsFlyingRightX.map((value, index, array) => {
            //console.log(index)
            let top = ((this.state.enemiesBulletsFlyingRightY[index] + 40) + "px").toString();
            let left = ((this.state.enemiesBulletsFlyingRightX[index]) + "px").toString();
            let bulletYIndex = this.state.enemiesBulletsFlyingRightY[index];
            let bulletXIndex = this.state.enemiesBulletsFlyingRightX[index]
            if (bulletYIndex > 0 && bulletYIndex < 880 && bulletXIndex < 1380) {
                return this.createEnemyRightBullet(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }

    renderEnemiesSpecialBullets(){
        return this.state.specialEnemiesBulletsX.map((value, index, array) => {
            //console.log(index)
            let top = ((this.state.specialEnemiesBulletsY[index] + 40) + "px").toString();
            let left = ((this.state.specialEnemiesBulletsX[index]) + "px").toString();
            let bulletYIndex = this.state.specialEnemiesBulletsY[index];
            let bulletXIndex = this.state.specialEnemiesBulletsX[index]
            if (bulletYIndex > 30 && bulletYIndex < 870 && bulletXIndex < 1300 && bulletXIndex > 50) {
                return this.createEnemySpecialBullet(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }

    renderBullets() {
        return this.state.bulletX.map((value, index, array) => {
            let top = ((this.state.bulletY[index] + 40) + "px").toString();
            let left = ((this.state.bulletX[index]) + "px").toString();
            let bulletYIndex = this.state.bulletY[index];
            if (bulletYIndex > 0) {
                return this.createBullet(index, left, top);
            } else {
                return undefined;
            }
        }, this);
    }


    renderEnemies() {
        let { bottom, aliveEnemies, enemyImages, enemyTypes } = this.state;
        bottom = bottom - 30;
        return this.state.enemiesX.map((value, index, array) => {
            let top = ((this.state.enemiesY[index] + 40)+ "px").toString();
            let left = (value + "px").toString();
            let enemiesYIndex = this.state.enemiesY[index];
            if (enemiesYIndex < bottom) {
                if (aliveEnemies[index] === 1) {
                    return (
                        <div key={`enemy_${index}`} style={{ position: 'absolute', left: left, top: top, alignContent: 'center' }}>
                            <img src={enemyImages[enemyTypes[index]]} width="50px" alt='e' />
                        </div>
                    )
                }
            }
            else if (aliveEnemies[index] === 1 && enemiesYIndex >= bottom) {
                aliveEnemies[index] = 0;
                this.setState({
                    aliveEnemies,
                })
            }
        }, this);
    }


    gameOver() {
        //console.log("Game over");
        this.setState({
            gameOver: true,
        })
        this.gamePause();
        localforage.setItem('ScoreAmount', JSON.stringify(this.state.score)).then((value) => {
            browserHistory.push('/gameover', {score: this.state.score})
        })
    }


    showShipBlast(blast = true) {
        let img = blast ? Enemy_Explosion : Hero_Ship;
        this.setState({
            shipImage: img
        })
        if (blast) {
            setTimeout(() => {
                this.showShipBlast(false);
            }, 1500)
        }
    }

    gamePause() {
        //console.log("GamePause called");
        if (!this.state.gameOver) {
            this.setState({
                pause: !this.state.pause,
            })
        } else {
            this.setState({
                pause: true
            });
        }
    }

    renderPlayButton() {
        if (!this.state.gameOver) {
            if (this.state.pause) {
                return <span>Play</span>;
            } else {
                return <span>Pause</span>;
            }
        } else {
            return <span>Restart</span>;
        }
    }

    releaseBlaster() {
        let { numberOfBlasters } = this.state;
        if (numberOfBlasters > 0) {
            let { width } = this.getBoundaries();
            width = width - 570;
            for (let i = 0; i < width; i += 10) {
                this.generateBullet(i);
            }
            numberOfBlasters--;
            this.setState({
                numberOfBlasters
            })
        } else {
            console.log("Blaster Stock Empty");
        }
    }


    moveLeft(){
        if (!this.state.pause) {
            let {width} = this.getBoundaries();
            if (width > 800){
                width = width - 540;
            }
            let {playerStyle} = this.state;
            let px = playerStyle.left - 30;
            let py = playerStyle.top;
            if (0 < px && px < width) {
                this.setState({
                    playerStyle: { left: px, top: py }
                })
            }
            else{
                px = px + 10;
                if (px > width){
                    this.setState({
                        playerStyle: { left: width - 20, top: py}
                    })
                }
            }
        }
    }

    moveUp(){
        //console.log('moveup')
        if (!this.state.pause){
            let {playerStyle} = this.state;
            let px = playerStyle.left;
            let py = playerStyle.top - 30;
            if (0 < py){
                this.setState({
                    playerStyle: { left: px, top: py }
                })
            }
        }
    }


    moveRight(){
        if (!this.state.pause) {
            let {width} = this.getBoundaries();
            if (width > 800){
                width = width - 540;
            }
            let {playerStyle} = this.state;
            let px = playerStyle.left + 30;
            let py = playerStyle.top;
            if (px < width - 40) {
                this.setState({
                    playerStyle: { left: px, top: py }
                })
            }
            else{
                if (px > width - 40){
                    this.setState({
                        playerStyle: { left: width - 40, top: py}
                    })
                }
            }
        }
    }

    moveDown(){
        if (!this.state.pause){
            let {height, width} = this.getBoundaries();
            //console.log(height)
            height = height - 150;
            if (width <= 800) {
                height = height - 50;
            }
            let {playerStyle} = this.state;
            let px = playerStyle.left;
            let py = playerStyle.top + 30;
            if (py < height){
                this.setState({
                    playerStyle: { left: px, top: py}
                })
            }
        }

    }

    keyPress(event) {
        this.setState({ snackBarOpen: false });
        if (event.which === 13) {
            // SpaceBar was pressed
            this.gamePause();
        }
        else if (!this.state.pause) {
            if (event.which === 32) {
                this.generateBullet();
            }
            if (event.which === 98) {
                // "B" key was pressed to release Blaster
                this.releaseBlaster();
            }
            if (event.key === 'a' || event.key === 'A'){
                this.moveLeft();
            }
            if (event.key === 'w' || event.key === 'W'){
                this.moveUp();
            }
            if (event.key === 'd' || event.key === 'D'){
                this.moveRight()
            }
            if (event.key === 's' || event.key === 'S'){
                this.moveDown();
            }
        }
    }

    render() {
        return (
            <div className="mainContainer" ref="mainContainer" tabIndex="0" onKeyPress={this.keyPress.bind(this)}>
                <div className="main">


                    <div className="gameRegion" ref="gameRegion" onMouseMove={this.mouseMove.bind(this)}>


                        <div key="gameRegionDiv" style={{ position: "relative" }}>
                            <Info key="infoComponent" score={this.state.score} lives={this.state.lives} pause={this.state.pause} blasters={this.state.numberOfBlasters} />
                            {this.renderEnemies()}
                            {this.renderBullets()}
                            {this.renderEnemiesBulletFlyingDown()}
                            {this.renderEnemiesBulletFlyingLeft()}
                            {this.renderEnemiesBulletFlyingRight()}
                            {this.renderEnemiesSpecialBullets()}
                            {this.renderBonuses()}
                        </div>
                        

                
                        <div ref="playerRegion" className="playerRegion" >
                            <div ref="player" className="player" style={{ alignContent: 'center', left: (this.state.playerStyle.left + "px").toString(), top: (this.state.playerStyle.top + "px").toString() }}>
                                <img src={this.state.shipImage} className="playerImage" alt="P" />
                            </div>
                        </div>

                        <div class="side-panel">
                                <div class="buttons-panel">
                                    <button type="button" class="buttons up" onClick={this.moveUp.bind(this)}>⬆</button>
                                    <button type="button" class="buttons left" onClick={this.moveLeft.bind(this)} >←</button>
                                    <button type="button" class="buttons shoot" onClick={this.generateBullet.bind(this)}>SHOOT</button>
                                    <button type="button" class="buttons right" onClick={this.moveRight.bind(this)}>→</button>
                                    <button type="button" class="buttons down" onClick={this.moveDown.bind(this)}>↓</button>
                                </div>
                            </div>

                        <Snackbar
                            open={this.state.snackBarOpen}
                            message="Spaceship Blast"
                            autoHideDuration={10000}
                            onRequestClose={
                                () => {
                                    this.setState({
                                        snackBarOpen: false,
                                    });
                                }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}