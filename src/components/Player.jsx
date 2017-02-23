import React, { Component, PropTypes } from 'react';
import { Avatar } from 'components';
import { LEFT, UP, RIGHT, DOWN } from '../helpers/constants';

class Player extends Component {

	handleKeyDown = (e) => {
		let newDirection;

		switch(e.keyCode) {
			case 37:
				newDirection = { top: 0, left: -10, dir: LEFT};
				break;
			// case 38:
			// 	// move top, should disable
			// 	newDirection = { top: -10, left: 0, dir: UP};
			// 	break;
			case 39:
				newDirection = { top: 0, left: 10, dir: RIGHT};
				break;
			// case 40:
			// 	// move bottom, should disable
			// 	newDirection = { top: 10, left: 0, dir: DOWN};
			// 	break;
			default:
				return;
		}
		this.props.handlePlayerMovement(newDirection);
	}

	componentDidMount() {
		window.onkeydown = this.handleKeyDown;
	}

	render() {
		const { size, position:{top, left}} = this.props;
		return (
			<div>
				<Avatar 
					position={{top, left}}
					size={size}
					color='#fffde0'
				/>
			</div>
		)
	}
}

Player.propTypes = {
	handlePlayerMovement: PropTypes.func.isRequired,
	size: PropTypes.number.isRequired,
	position: PropTypes.shape({
		top: PropTypes.number.isRequired,
		left: PropTypes.number.isRequired
	})
}


export default Player;