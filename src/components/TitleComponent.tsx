import React from "react";

export class TitleComponent extends React.Component<{ title: string }> {
	render() {
		return (
			<div style={{ textAlign: "center" }}>
				<h1>{this.props.title}</h1>
			</div>
		);
	}
}
