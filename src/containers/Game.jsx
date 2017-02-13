import React, { Component } from 'react';
import { Board, Player, Platform, GameStatus } from '../components';
import { UP, DOWN, LEFT, RIGHT } from '../helpers/constants';
import { randomGen } from '../helpers/utils';
import { SPIKES, NORMAL, SPRING, MOVERIGHT, MOVELEFT, FALLEN } from '../helpers/constants'; 

// const platformType = [SPIKES, NORMAL, SPRING, MOVERIGHT, MOVELEFT];
const platformType = [ FALLEN ];


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
		fallingSpeed: 4,
		playerScore: 0, // lv
		playerLifePoint:20,
		platformSpeed: 5,
		platformIndex: 0,
		activePlatforms: 4,
		// platformIndex: 1
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
		// console.log(JSON.stringify(newPlatform))

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

		console.log('touch', pfType)
		let newPlayerTop = pfTop - player + platformSpeed;
		let newLifePoint = playerLifePoint; 

		newLifePoint = this.updateLifePoint(pfType, newLifePoint);

		// check if < 1 or gameover /////////////////////////////

		if(pfType === FALLEN){
			this.removePlatform(pfKey);
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

	updateLifePoint = (pfType, lifePoint) => {
		
		if(pfType === NORMAL){
			lifePoint += 2;
			if(lifePoint > 20){
				lifePoint = 20;
			}
		}else if(pfType === SPIKES){
			lifePoint -= 4;
		}
		
		return lifePoint;
	}

	handlePlayerMovement = (dirObj) => {
		const { top, left } = this.state.positions.player;
		const { player, board: boardSize } = this.state.size;
		const { collisionWith } = this.state;

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

	startGame = () =>{
		// this.platformInterval = setInterval(this.updatePlatformPositions, 50);
		this.mainInterval = setInterval(()=>{
			this.updatePlatformPositions();
			this.updatePlayerPositions();
		}, 60);
		this.gameInterval = setInterval(this.updatePlatformsInPlay, 1000);
	}

	updateGame = () => {

	}

	updatePlayerPositions = () => {
		const {platformSpeed, fallingSpeed, positions:{player, platforms}, collisionWith} = this.state;
	
		let newTop, 
			newLeft,
			currentPlatform,
			newCollisionWith;

		newCollisionWith = collisionWith;
		newLeft = player.left;

		if(collisionWith !== null){

			currentPlatform = platforms.filter(fp => fp.key === collisionWith )[0];
			// console.log(currentPlatform.top)
			// console.log(this.state.size.platform.height)
			newTop = player.top - platformSpeed;
			// newTop = currentPlatform.top - this.state.size.platform.height - platformSpeed;

			if(currentPlatform.type === SPRING){
				newTop -= 100;
			}else if(currentPlatform.type === MOVERIGHT){
				newLeft += 2;
			}else if(currentPlatform.type === MOVELEFT){
				newLeft -= 2;
			}

			if(!this.checkCollision(collisionWith)){
				newCollisionWith = null;
			}
		}else{
			newTop = player.top + fallingSpeed;
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
			collisionWith: newCollisionWith
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

	removePlatform = (pfKey) => {

		const { positions:{platforms}} = this.state;
		const delay = 800; // 0.8 sec

		setTimeout(function(){
			this.setState({
				...this.state,
				positions:{
					...this.state.positions,
					platforms: platforms.filter(pf => pf.key !== pfKey)
				},
				collisionWith: null
			})
		}.bind(this), delay);

	}

	render(){	
		const {
			size: {board, player},
			positions: {player:playerPos},
			collisionWith,
			playerLifePoint,
		} = this.state;

		return (
			<div>
				Main component
				<br/><br/>
				<GameStatus lifePoint={playerLifePoint}/>
				<br/>
				<hr/>
				<Board boardSize={this.props.boardSize} >
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
		clearInterval(this.state.mainInterval);
		clearInterval(this.state.gameInterval);
	}
}