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
				<div style={pfListItemStyle('#b35900')}>NORMAL</div>
				<div style={pfListItemStyle('#b3ffa8')}>SPRING</div>
				<div style={pfListItemStyle('#fc9797')}>SPIKES</div>
				<div style={pfListItemStyle('#a6a6a6')}>MOVE RIGHT</div>
				<div style={pfListItemStyle('#a6a6a6')}>MOVE LEFT</div>
				<div style={pfListItemStyle('#e6ffff')}>FALLEN</div>
			</div>
		)
	}
}

export default InfoBoard;