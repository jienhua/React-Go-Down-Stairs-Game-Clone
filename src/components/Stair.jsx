import React from 'react';
import { NORMAL, SPIKES, SPRING } from '../helpers/constants';


const style = ({size, position, type}) => {

	let color = 'white';

	switch(type){
		case NORMAL:
			color = 'grey';
			break;
		case SPRING:
			color = 'green';
			break;
		case SPIKES:
			color = 'red';
			break;
	}

    return {
        width: size*3 + 'px',
        height: Math.floor(size/2) + 'px',
        backgroundColor: color,
        position: 'absolute',
        top: position.top + 'px',
        left: position.left + 'px',
        transition: 'all 0.1s ease'
    };
}

export default (props) => <div style={style(props)}/>