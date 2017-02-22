import React, { Component } from 'react';

const leaderboardLeftStyle = () =>{
	return {
		position: 'relative',
		float: 'left',
		marginRight: '20px'
	}
}

const leaderboardRightStyle = () =>{
	return {
		float: 'left'
	}
}

const listItemStyle = () =>{
	return {
		marginLeft: '20px'
	}
}

class Leaderboard extends Component {

	render() {
		const scores = this.props.top10;
		return (
			<div>
				<h4 style={{marginBottom:'0px', marginLeft:'20px'}}>Leaderboard</h4>
				{scores?
					<div>
						<div style={leaderboardLeftStyle()}>
							{scores.slice(0, 5).map((i,index)=>{
								return <div style={listItemStyle()} key={index}><span>{index + 1}. {i.score}</span></div>
							})}
						</div>
						<div style={leaderboardRightStyle()}>
							{scores.slice(0,10).map((i, index)=>{
								if(index < 5){return;}
								return <div style={listItemStyle()} key={index}><span >{index + 1}. {i.score}</span></div>
							})}
						</div>
					</div>
				: <div>Loading...</div>
				}
				<div style={{clear:'both'}}></div>
			</div>
		)
	}
}

export default Leaderboard;