import React from 'react';

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
		// console.log('yoyoyoyo')
		holder.push(<div key={i} style={lifePointStyle(color)}></div>)
	}
	return holder;
}


export default ({lifePoint, resetGame}) => (

	<div>
		Life Point: {lifePoint}

		<div name='lifePointBar'>
			{createLifeBar(lifePoint)}
		</div>
		<div style={controlPanelStyle()}>
			<button onClick={resetGame} >Reset</button>
		</div>
	</div>
)

