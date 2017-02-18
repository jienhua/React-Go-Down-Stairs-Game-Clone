import React, { Component } from 'react';
import { Board, Player, Platform, GameStatus } from '../components';
import { UP, DOWN, LEFT, RIGHT } from '../helpers/constants';
import { randomGen } from '../helpers/utils';
import { SPIKES, NORMAL, SPRING, MOVERIGHT, MOVELEFT, FALLEN, TOP, BOTTOM } from '../helpers/constants'; 

// const platformType = [SPIKES, NORMAL, SPRING, MOVERIGHT, MOVELEFT, FALLEN];
const platformType = [ NORMAL ];


const getDefaultState = ({ boardSize, playerSize}) => {
	// const half = Math.floor(boardSize.width/2)
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
		isEndGame: false,
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
	
		const type = platformType[randomGen(platformType.length)]
		
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
		let platform = positions.platforms.filter(item => item.key === pfKey)[0]
		// console.log(playerPosition.top , playerPosition.left, platform.top, platform.left)
		if ((playerPosition.top + size) >= platform.top &&
			(playerPosition.top + size) < platform.top + Math.floor(size/2) &&
			playerPosition.left+size >= platform.left &&
			(playerPosition.left + size) <= (platform.left + size * 4)) {
			// this.props.onCollide(type, top)
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

		// console.log('touch', pfType, pfKey)
		let newPlayerTop = pfTop - player + platformSpeed;
		let newLifePoint = playerLifePoint; 

		newLifePoint = this.updateLifePoint(pfType, newLifePoint);

		if(pfType === FALLEN){
			let delay = 0.7 // 0.8 seconds
			setTimeout(()=>{
				this.removePlatform(pfKey);
			}, delay)
			
		}

		this.setState({
			...this.state,
			positions:{
				...this.state.positions,
				player:{
					top: newPlayerTop,
					left: this.state.positions.player.left
				}
			},
			collisionWith: pfKey,
			playerLifePoint: newLifePoint
		})
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

		clearInterval(this.mainInterval);
		// clearInterval(this.gameInterval);
		clearInterval(this.timeInterval);

		setTimeout(()=>{
			this.setState({
				isEndGame: true
			})
		}, 50);
	}

	resetGame = () => {
		const { boardSize, playerSize } = this.props;

		this.endGame();
		
		setTimeout(()=>{
			this.setState({
				...getDefaultState({ boardSize, playerSize }),	
			})
		}, 50);	
		this.startGame();
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
				})
			}
		}
	}

	startGame = () =>{
		const { isEndGame, gameIntervalTime } = this.state; 

		this.timeInterval = setInterval(this.updateGame, 1000);
		this.mainInterval = setInterval(()=>{
			this.updatePlatformPositions();
			this.updatePlayerPositions();
		}, 60);
		// this.gameInterval = setInterval(this.updatePlatformsInPlay, 1000);
		let gameInterval = () => {

			if(isEndGame){return;}
			// console.log(JSON.stringify(this.state));
			this.updatePlatformsInPlay();
			setTimeout(gameInterval, gameIntervalTime);
		}
		gameInterval();
	}

	updateGame = () => {
		const { timeElapsed, platformSpeed } = this.state;


		this.updateTimeAndScore();
		if(timeElapsed > 0) {

			if( timeElapsed % 20 === 0) {
				this.incrementPlatformSpeed();
				this.incrementGameIntervalTime();
			}

			// if( timeElapsed % 25 ===0) {
			// 	this.incrementGameIntervalTime();
			// }
			
			if(timeElapsed % 30 === 0){
				this.decrementActivePlatforms();
			}
		}
	}

	updateTimeAndScore = () => {

		const { timeElapsed, playerScore } = this.state;

		this.setState({
			...this.state,
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
		// if(collisionWith !== null){

		// 	currentPlatform = platforms.filter(fp => fp.key === collisionWith )[0];
		// 	newTop = player.top - platformSpeed;

		// 	if(currentPlatform.type === SPRING){
		// 		newTop -= 50;
		// 	}else if(currentPlatform.type === MOVERIGHT){
		// 		newLeft += 3;
		// 	}else if(currentPlatform.type === MOVELEFT){
		// 		newLeft -= 3;
		// 	}
			
		// 	// make sure player stay in top-boundary 
		// 	if(newTop <= 0){
		// 		newTop = 0;
		// 	}

		// 	if(!this.checkCollision(collisionWith)){
		// 		newCollisionWith = null;
		// 	}
		// }else{
		// 	newTop = player.top + fallingSpeed;
		// }
		/////////////////////////////////////////////////

		// check if player out of bound
		if(newTop === 0){
			newLifePoint = this.updateLifePoint(TOP, newLifePoint);
		}else if(newTop > board.height){
			newLifePoint = this.updateLifePoint(BOTTOM, newLifePoint);
		}
		
		
		this.setState({
			...this.state,
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

		const { activePlatforms } = this.state;
		const { platforms } = this.state.positions;
		
		if (platforms.length < activePlatforms) {
			
			this.placePlatfrom();
		}
	}

	incrementPlatformSpeed = () => {
		const { platformSpeed } = this.state;

		if( platformSpeed < 10){
			this.setState({
				...this.state,
				platformSpeed: platformSpeed + 1
			}, ()=>{
				console.log('platformSpeed updated');
				console.log(JSON.stringify(this.state));
			})
		}
	}

	decrementActivePlatforms = () => {
		const { activePlatforms } = this.state;

		if( activePlatforms >4 ){
			this.setState({
				...this.state,
				activePlatforms: activePlatforms - 1
			}, ()=>{
				console.log('activePlatforms update');
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
				...this.state,
				gameIntervalTime: newIntervalTime
			}, () =>{
				console.log('game interval itme update');
		})
	}

	removePlatform = (pfKey) => {

		const { positions:{platforms}} = this.state;

		this.setState({
				...this.state,
				positions:{
					...this.state.positions,
					platforms: platforms.filter(pf => pf.key !== pfKey)
				},
				collisionWith: null
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
			playerScore
		} = this.state;

		return (
			<div>
				Main component
				<br/><br/>
				<GameStatus lifePoint={playerLifePoint}
							resetGame={this.resetGame}
							speed={platformSpeed}
							active={activePlatforms}
							time={timeElapsed}
							gameSpeed={gameIntervalTime}
							floor={playerScore}/>
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
	}

	componentWillUnmount(){
		clearInterval(this.state.timeInterval);
		clearInterval(this.state.mainInterval);
		// clearInterval(this.state.gameInterval);
	}
}