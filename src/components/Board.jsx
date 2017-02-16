import React from 'react';
// import {Grid, Col, Row} from 'react-bootstrap'
import {InfoBoard, SpikyCeiling} from 'components';

const boardStyle = (height, width, isEnd) =>{

	return {
		width: width+'px',
		height: height+'px',
		border: '1px solid black',
		position: 'relative',
		// margin: '25px',
		// marginRight: 'auto',
		overflow: 'hidden',
		float:'left',
		opacity: isEnd? 0.5 : 1,
		backgroundColor: isEnd? "black" : "white"
	};
};

const style = (isEnd) =>{

	return {
		margin:'25px 20%',
	}
}

export default ({boardSize, isEnd, children}) => (
	
	<div style={style()}>
		<div style={boardStyle(boardSize.height, boardSize.width, isEnd)}>
			<SpikyCeiling/>
			{isEnd}
			{children}
		</div>
		<InfoBoard width={boardSize.width} />
		<div style={{"clear":"both"}}></div>
	</div>
	
)
