import React, { Component, PropTypes } from 'react';
import { Stair } from 'components';


class Platform extends Component {

	componentDidUpdate() {
		const {info: {key, top, type}, collisionWith, checkCollision, onCollide} = this.props;
		
		if(key !== collisionWith &&
			checkCollision(key)){

			onCollide(key, top, type);	
		}

	}

	render() {
		const { size, info: { top, left, type, key}} = this.props;
		return (
			<Stair 
				size={size}
				position={{top, left}}
				type={type}
			/>
		)
	}
}

Platform.propTypes = {
	info: PropTypes.shape({
		top: PropTypes.number.isRequire,
		left: PropTypes.number.isRequire,
		type: PropTypes.string.isRequire,
		key: PropTypes.number.isRequire
	}),
	// size: PropTypes.number.isRequire,
	collisionWith: PropTypes.number,
	// checkCollision: PropTypes.func.isRequire,
	// onCollide: PropTypes.func.isRequire
}

export default Platform;