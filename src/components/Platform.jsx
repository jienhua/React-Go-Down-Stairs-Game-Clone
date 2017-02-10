import React, { Component, PropTypes } from 'react';
import { Stair } from 'components';

class Platform extends Component {

	componentDidUpdate() {
		const {info: {key, top, left, type}, collisionWith, checkCollision} = this.props;
		
		if(key !== collisionWith &&
			this.props.checkCollision(key)){

			this.props.onCollide(key, top, type)
		}

	}

	render() {
		const { size, info: { top, left, type }} = this.props;
		return (
			<Stair 
				size={size}
				position={{top, left}}
				type={type}
			/>
		)
	}
}

// Platform.propTypes = {
// 	size: PropTypes.number.isRequire,

// }

export default Platform;