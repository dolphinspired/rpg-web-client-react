import React from "react";

export default class App extends React.Component<{ id: string }> {
	render() {
		return (
			<div id={this.props.id}></div>
		);
	}
}
