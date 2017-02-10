import React from 'react';
import { render } from 'react-dom';
import Game from './containers/Game';

const boardSize = {
	height: 400,
	width: 300
};

const playerSize = 30;


render(
	<Game boardSize={boardSize} playerSize={playerSize}/>,
	document.getElementById('root')
)