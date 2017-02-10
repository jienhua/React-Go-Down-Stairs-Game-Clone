import React, { Component } from 'react';

const style = (width) =>{

	return {
		width: '150px',
		// border:'1px solid black',
		position: 'relative',
		marginLeft: width+'px',
		paddingLeft: '30px'
	}
}

const pfListItemStyle = (color) =>{

	return {
		width: '100px',
		color: 'black',
		backgroundColor: color,
		margin: '10px',
		paddingLeft: '5px'
	}
}

class InfoBoard extends Component{

	render() {
		return (
			<div style={style(this.props.width)}>
				Platform Description
				<br/>
				<hr/>
				<div style={pfListItemStyle('grey')}>NORMAL</div>
				<div style={pfListItemStyle('green')}>SPRING</div>
				<div style={pfListItemStyle('red')}>SPIKES</div>
			</div>
		)
	}
}

export default InfoBoard;