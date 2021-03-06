import React from 'react';
import {Leaderboard} from 'components';

const lifePointStyle = (color='green')=> {

	return {
		backgroundColor:color,
		width:'5px',
		height: '14px',
		marginRight: '1px',
		float: 'left',
		border: '1px solid black'

	}
}

const controlPanelStyle = () =>{
	return {
		float: 'right'
	}
}

const createLifeBar = (lifePoint) =>{
	let holder = [];
	let color = 'black';

	if(lifePoint<= 20 && lifePoint >=13){
		color = 'green';
	}else if(lifePoint <=12 && lifePoint >= 8){
		color = 'orange';
	}else{
		color = 'red';
	}

	for(let i = 0;i<lifePoint; i++){
		holder.push(<div key={i} style={lifePointStyle(color)}></div>)
	}
	return holder;
}


export default ({lifePoint, resetGame, startGame, speed, active, time,gameSpeed, floor, top10}) => (

	<div>
		Floor-B {floor}
		<br/>
		<Leaderboard top10={top10} />
		<hr/>
		Life Point: {lifePoint}

		<div name='lifePointBar'>
			{createLifeBar(lifePoint)}
		</div>
		<div style={controlPanelStyle()}>
			<button onClick={startGame}>Start</button> 
			<button onClick={resetGame}>Reset</button>
		</div>
	</div>
)

