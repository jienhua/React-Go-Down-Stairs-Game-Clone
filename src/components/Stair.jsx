import React from 'react';
import { NORMAL, SPIKES, SPRING, MOVERIGHT, MOVELEFT, FALLEN } from '../helpers/constants';


const style = ({size, position, type}) => {

	let color = 'white';

	switch(type){
		case NORMAL:
			color = '#663300';
			break;
		case SPRING:
			color = '#b3ffa8';
			break;
		case SPIKES:
			color = '#fc9797';
			break;
		case MOVERIGHT:
			color = '#a6a6a6';
			break;
		case MOVELEFT:
			color = '#a6a6a6';
			break;
		case FALLEN:
			color = '#e6ffff';
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

const patten = ({type}) => {
	let patten = '';

	switch(type){
		case NORMAL:
			break;
		case SPRING:
			patten = (<spam>&#8803;&#8803;&#8803;&#8803;&#8803;&#8803;&#8803;</spam>);
			break;
		case SPIKES:
			patten = (<spam>&Delta;&Delta;&Delta;&Delta;&Delta;&Delta;&Delta;&Delta;&Delta;</spam>);
			break;
		case MOVERIGHT:
			patten = (<spam>&#8883;&#8883;&#8883;&#8883;&#8883;&#8883;&#8883;</spam>);
			break;
		case MOVELEFT:
			patten = (<spam>&#8882;&#8882;&#8882;&#8882;&#8882;&#8882;&#8882;</spam>);
			break;
		case FALLEN:
			patten = '(-_--__---_-_)';
			break;
	}

	return patten;

}

export default (props) =>(
	<div style={style(props)}>
		<strong>{patten(props)}</strong>
	</div>
)