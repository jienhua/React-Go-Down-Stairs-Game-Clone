import React, { Component } from 'react';
import axios from 'axios';
import { Board, Player, Platform, GameStatus } from '../components';
import { UP, DOWN, LEFT, RIGHT } from '../helpers/constants';
import { randomGen } from '../helpers/utils';
import { SPIKES, NORMAL, SPRING, MOVERIGHT, MOVELEFT, FALLEN, TOP, BOTTOM } from '../helpers/constants'; 


// const platformType = [SPIKES, NORMAL, SPRING, MOVERIGHT, MOVELEFT, FALLEN];
const platformType = [ NORMAL ];


const getDefaultState = ({ boardSize, playerSize}) => {
	return {
		size: {
			board:{
				height: boardSize.height, 
				width: boardSize.width
			},
			player: playerSize,
			platform:{
				height: Math.floor(playerSize/2),
				width: playerSize * 4
			}
		},
		positions: {
			player:{
				top: Math.floor(boardSize.height/2)-playerSize,
				left: Math.floor(boardSize.width/2)-Math.floor(playerSize/2),
			},
			platforms: [
				{ 
					key: 0, 
					type: 'NORMAL',
					top: Math.floor(boardSize.height/2),
					left: Math.floor(boardSize.width/2)-playerSize*1.5
				}
			]
		},
		collisionWith: null,
		fallingSpeed: 5,
		playerScore: 0, // lv
		playerLifePoint:20,
		platformSpeed: 4,
		platformIndex: 1,
		activePlatforms: 5,
		timeElapsed: 0,
		isEndGame: true,
		gameIntervalTime: 1000

	} 
}


export default class Game extends Component {

	constructor(props){
		super(props);
		const { boardSize, playerSize } = props;
		this.state = getDefaultState({ boardSize, playerSize });
	}

	placePlatfrom = () => {
		const { board, platform } = this.state.size;

		const startPosition = randomGen(board.width-platform.width);
	
		const type = platformType[randomGen(platformType.length)];
		
		const newPlatform = this.generatePlatform(startPosition, type); 

		this.setState({
			positions:{
				...this.state.positions,
				platforms:[...this.state.positions.platforms,
						newPlatform
					]
			}
		});

	}

	checkCollision = (pfKey) =>{
		const {size:{player, board}, positions } = this.state;

		let playerPosition = positions.player;
		let size = player;
		let platform = positions.platforms.filter(item => item.key === pfKey)[0];

		if ((playerPosition.top + size) >= platform.top &&
			(playerPosition.top + size) < platform.top + Math.floor(size/2) &&
			playerPosition.left+size >= platform.left &&
			(playerPosition.left + size) <= (platform.left + size * 4)) {
			
			return true;
		}
		return false;
	}

	generatePlatform = (position, type) => {
		const { board: {height}} = this.state.size;
		this.setState({
			platformIndex: this.state.platformIndex + 1
		});

		const newPlatfrom = { 
			key: this.state.platformIndex, 
			type: type,
			top: height,
			left: position};

		return newPlatfrom;
	}

	handlePlayerCollision = (pfKey, pfTop, pfType) => {
		const {platformSpeed, size:{player}, playerLifePoint, positions:{playerPosition:top}} = this.state;

		let newPlayerTop = pfTop - player + platformSpeed;
		let newLifePoint = playerLifePoint; 

		newLifePoint = this.updateLifePoint(pfType, newLifePoint);

		if(pfType === FALLEN){
			let delay = 0.7 // 0.7 seconds
			setTimeout(()=>{
				this.removePlatform(pfKey);
			}, delay);
			
		}

		this.setState({
			// ...this.state,
			positions:{
				...this.state.positions,
				player:{
					top: newPlayerTop,
					left: this.state.positions.player.left
				}
			},
			collisionWith: pfKey,
			playerLifePoint: newLifePoint
		});
	}

	updateLifePoint = (type, lifePoint) => {
		
		if(type === NORMAL){
			lifePoint += 2;
			if(lifePoint > 20){
				lifePoint = 20;
			}
		}else if(type === SPIKES || type === TOP){
			lifePoint -= 4;
		}else if(type === BOTTOM){
			lifePoint = 0;
		}
		if(lifePoint <= 0){
			this.endGame();
		}
		return lifePoint;
	}

	endGame = () =>{
		const {isEndGame, top10Scores, playerScore } = this.state;

		// if(!isEndGame && (top10Scores.length < 10 ||
		// 	top10Scores[top10Scores.length-1].score < playerScore)){
		// 	var name = prompt("Enter your name", "Anonymous");
		// 	if(name === null || name === ''){
		// 		name = 'Anonymous';
		// 	}
		// 	this.updateTop10Scores({
		// 		name: name,
		// 		score: playerScore
		// 	});
		// }

		clearInterval(this.mainInterval);
		clearInterval(this.timeInterval);

		
		this.setState({
			isEndGame: true
		});
		
	}

	resetGame = () => {
		const { boardSize, playerSize } = this.props;

		this.endGame();

		this.setState({
			...getDefaultState({ boardSize, playerSize })
		});

		this.fetchTop10Scores();	
	}

	handlePlayerMovement = (dirObj) => {
		const { top, left } = this.state.positions.player;
		const { player, board: boardSize } = this.state.size;
		const { collisionWith, isEndGame } = this.state;

		if(!isEndGame){
			// check walls
			switch (dirObj.dir) {
				case UP:
					if (top <= 0) return;
					break;
				case DOWN:
					if (top >= boardSize.height - player) return;
					break;
				case LEFT:
					if (left <= 0) return; 
					break;
				case RIGHT:
					if (left >= boardSize.width-player) return;
					break;
			}

			this.setState({
				positions: {
					...this.state.positions,
					player:{
						top: top + dirObj.top,
						left: left + dirObj.left
					}
				}
			});

			if(collisionWith !== null && 
			   !this.checkCollision(collisionWith)){
				this.setState({
					collisionWith:null
				});
			}
		}
	}

	startGame = () =>{
		const { gameIntervalTime } = this.state; 

		let gameInterval = () => {
			if(this.state.isEndGame){return;}
			this.updatePlatformsInPlay();
			setTimeout(gameInterval, gameIntervalTime);	
		}

		if(this.state.isEndGame){
			this.setState({
				isEndGame:false
			}, ()=>{
				this.timeInterval = setInterval(this.updateGame, 1000);
				this.mainInterval = setInterval(()=>{
					this.updatePlatformPositions();
					this.updatePlayerPositions();
				}, 60);
				gameInterval();
			})
		}
	}

	updateGame = () => {
		const { timeElapsed, platformSpeed } = this.state;
		

		this.updateTimeAndScore();
		if(timeElapsed > 0) {

			if( timeElapsed % 20 === 0) {
				this.incrementPlatformSpeed();
				this.incrementGameIntervalTime();
			}
			
			if(timeElapsed % 30 === 0){
				this.decrementActivePlatforms();
			}
		}
	}

	updateTimeAndScore = () => {

		const { timeElapsed, playerScore } = this.state;

		this.setState({
			// ...this.state,
			timeElapsed: timeElapsed + 1, 
			playerScore: playerScore+ 1
		})
	}

	updatePlayerPositions = () => {
		const {size:{board}, platformSpeed, fallingSpeed, positions:{player, platforms}, collisionWith, playerLifePoint} = this.state;
	
		
		let newTop, 
			newLeft,
			currentPlatform,
			newCollisionWith,
			newLifePoint;

		newCollisionWith = collisionWith;
		newLeft = player.left;
		newLifePoint = playerLifePoint;

		// do stuff when player touch a platform
		///////////////////////////////////////////////
		if(collisionWith !== null){

			currentPlatform = platforms.filter(fp => fp.key === collisionWith )[0];
			newTop = player.top - platformSpeed;

			if(currentPlatform.type === SPRING){
				newTop -= 50;
			}else if(currentPlatform.type === MOVERIGHT){
				newLeft += 3;
			}else if(currentPlatform.type === MOVELEFT){
				newLeft -= 3;
			}
			
			// make sure player stay in top-boundary 
			if(newTop <= 0){
				newTop = 0;
			}

			if(!this.checkCollision(collisionWith)){
				newCollisionWith = null;
			}
		}else{
			newTop = player.top + fallingSpeed;
		}
		/////////////////////////////////////////////////

		// check if player out of bound
		if(newTop === 0){
			newLifePoint = this.updateLifePoint(TOP, newLifePoint);
		}else if(newTop > board.height){
			newLifePoint = this.updateLifePoint(BOTTOM, newLifePoint);
		}
		
		
		this.setState({
			// ...this.state,
			positions:{
				...this.state.positions,
				player:{
					top: newTop,
					left: newLeft
				}
			},
			collisionWith: newCollisionWith,
			playerLifePoint: newLifePoint
		})
	}

	updatePlatformPositions = () => {
		const { platformSpeed, positions: { platforms }, size:{player, board, platform}} = this.state;
		
		this.setState({
			positions:{
				...this.state.positions,
				platforms: platforms.filter( pf => !pf.remove).map( pf =>{
					if(pf.top < (0-platform.height)){
						pf.remove = true;
						return pf;
					}

					pf.top -= platformSpeed;
					return pf
				})
			}
		})
	}

	updatePlatformsInPlay = () => {
		// console.log(JSON.stringify(this.state))
		const { activePlatforms } = this.state;
		const { platforms } = this.state.positions;
		
		if (platforms.length < activePlatforms) {
			
			console.log( platforms.length, activePlatforms)
			this.placePlatfrom();
		}
	}

	incrementPlatformSpeed = () => {
		const { platformSpeed } = this.state;

		if( platformSpeed < 10){
			this.setState({
				// ...this.state,
				platformSpeed: platformSpeed + 1
			}, ()=>{
				console.log(JSON.stringify(this.state));
			})
		}
	}

	decrementActivePlatforms = () => {
		const { activePlatforms } = this.state;

		if( activePlatforms >4 ){
			this.setState({
				// ...this.state,
				activePlatforms: activePlatforms - 1
			})
		}
	} 

	incrementGameIntervalTime = () => {
		const { gameIntervalTime } = this.state;

		let newIntervalTime = gameIntervalTime;

		if( gameIntervalTime > 200){
			newIntervalTime -= 200;
		}else{
			newIntervalTime = 40;
		}

		this.setState({
				// ...this.state,
				gameIntervalTime: newIntervalTime
		})
	}

	removePlatform = (pfKey) => {

		const { positions:{platforms}} = this.state;

		this.setState({
				// ...this.state,
				positions:{
					...this.state.positions,
					platforms: platforms.filter(pf => pf.key !== pfKey)
				},
				collisionWith: null
		})
	}

	fetchTop10Scores = () => {
		axios.get('/scoreBoard')
			.then(data => {
				this.setState({
					top10Scores: data.data.top10
				},()=>{
					console.log('finish fetch top 10', JSON.stringify(this.state.top10Scores))
				})
			})
			.catch(err=> console.log(err))
	}

	updateTop10Scores = (data) => {
	
		console.log('update playerscore ', data.score);
		axios.post('/scoreBoard', {
			name: data.name,
			score: data.score
		})
		.then( res => {
			console.log(res);
		})
		.catch( err => {
			console.log(err);
		})
	}

	render(){	
		const {
			size: {board, player},
			positions: {player:playerPos},
			collisionWith,
			playerLifePoint,
			isEndGame,
			platformSpeed,
			activePlatforms,
			timeElapsed,
			gameIntervalTime,
			playerScore,
			top10Scores
		} = this.state;

		return (
			<div>
				Main component
				<br/><br/>
				<GameStatus lifePoint={playerLifePoint}
							resetGame={this.resetGame}
							startGame={this.startGame}
							speed={platformSpeed}
							active={activePlatforms}
							time={timeElapsed}
							gameSpeed={gameIntervalTime}
							floor={playerScore}
							top10={top10Scores}/>
				<br/>
				<hr/>
				<Board boardSize={this.props.boardSize} isEnd={isEndGame}>
					<Player 
						size={player}
						position={playerPos}
						handlePlayerMovement={this.handlePlayerMovement}
					/>
					{
						this.state.positions.platforms.map( pf =>
							<Platform 
								key={pf.key}
								size={player}
								info={pf}
								playerPosition={playerPos}
								onCollide={this.handlePlayerCollision}
								collisionWith = {collisionWith}
								checkCollision = {this.checkCollision}
							/>
						)
					}
				</Board>
			</div>
		)
	}
	

	componentDidMount(){
		this.startGame();
		this.fetchTop10Scores();
	}

	componentWillUnmount(){
		clearInterval(this.state.timeInterval);
		clearInterval(this.state.mainInterval);
		// clearInterval(this.state.gameInterval);
	}
}