import React from 'react';

const style = ({position, size, color}) => {
	const dim = size + 'px';
	return {
		width: dim,
		height: dim,
		backgroundColor: color,
		position: 'absolute',
		top: position.top+'px',
		left: position.left+'px',
		transition: 'all 0.1s ease',
		fontSize: '25px',
		textAlign: 'center'
	}
}

export default (props) => <div style={style(props)}>&#9924;</div>