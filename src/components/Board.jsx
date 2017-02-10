import React from 'react';
// import {Grid, Col, Row} from 'react-bootstrap'
import {InfoBoard} from 'components';

const boardStyle = (height, width) =>{

	return {
		width: width+'px',
		height: height+'px',
		border: '1px solid black',
		position: 'relative',
		// margin: '25px',
		// marginRight: 'auto',
		overflow: 'hidden',
		float:'left'
	};
};

const style = () =>{
	return {
		margin:'25px 20%'
	}
}

export default ({boardSize, children}) => (
	
	<div style={style()}>
		<div style={boardStyle(boardSize.height, boardSize.width)}>
			{children}
		</div>
		<InfoBoard width={boardSize.width} />
		<div style={{"clear":"both"}}></div>
	</div>
	
)
