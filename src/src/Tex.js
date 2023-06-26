import React, { Component } from 'react';
import katex from 'katex';

export default class extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    katex.render(this.props.children, this.myRef.current, {
      throwOnError: false
    });
  }

  render() {
    return <span ref={this.myRef} />;
  }
}
