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
			// 	newDirection = { top: -10, left: 0, dir: UP};
			// 	break;
			case 39:
				newDirection = { top: 0, left: 10, dir: RIGHT};
				break;
			// case 40:
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
					color='orange'
				/>
			</div>
		)
	}
}



export default Player;