import React, { Component } from 'react';
import { Board, Player, Platform, GameStatus } from '../components';
import { UP, DOWN, LEFT, RIGHT } from '../helpers/constants';
import { randomGen } from '../helpers/utils';
import { SPIKES, NORMAL, SPRING } from '../helpers/constants'; 

const platformType = [SPIKES, NORMAL, SPRING];

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
		platformSpeed: 1,
		platformIndex: 0,
		activePlatforms: 2

	} 
}


export default class Game extends Component {

	constructor(props){
		super(props);
		const { boardSize, playerSize } = props;
		this.state = getDefaultState({ boardSize, playerSize });
		this.updatePlayerPositions   = this.updatePlayerPositions.bind(this);
		this.updatePlatformPositions = this.updatePlatformPositions.bind(this);
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

	handlePlayerCollision = (fpKey, fpTop, fpType) => {
		const {size:{player}, playerLifePoint, positions:{playerPosition:top}} = this.state;

		console.log('touch', fpType)
		let newLifePoint = playerLifePoint;
		let newPlayerTop = fpTop - player + 1;
		let newCollisonWith = fpKey;

		if(fpType === NORMAL){
			newLifePoint += 2;
			if(newLifePoint > 20){
				newLifePoint = 20;
			}
		}else if(fpType === SPRING){
			newPlayerTop -= 100;
			newCollisonWith = null;
		}else if(fpType === SPIKES){
			newLifePoint -= 4;
			if(newLifePoint < 1){
				//call game over
			}
		}
		console.log(newLifePoint)

		this.setState({
			...this.state,
			positions:{
				...this.state.positions,
				player:{
					top: newPlayerTop,
					left: this.state.positions.player.left
				}
			},
			collisionWith: newCollisonWith,
			playerLifePoint: newLifePoint
		})
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
		}, 50);
		this.gameInterval = setInterval(this.updatePlatformsInPlay, 1000);
	}

	updateGame = () => {

	}

	updatePlayerPositions = () => {
		const {platformSpeed, fallingSpeed, positions:{player}, collisionWith} = this.state;
		// console.log('her');
		let NewTop, NewLeft;
		
		if(collisionWith !== null){
			NewTop = player.top - platformSpeed;
		}else{
			NewTop = player.top + fallingSpeed;
		}
		
		NewLeft = player.left;
		
		this.setState({
			positions:{
				...this.state.positions,
				player:{
					top: NewTop,
					left: NewLeft
				}
			}
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