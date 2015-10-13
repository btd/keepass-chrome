import React from 'react';

import click from './click';

const FileInput = React.createClass({
  getInitialState() {
    return {
      selectedFileName: ''
    }
  },

  getDefaultProps() {
    return {
      accept: ''
    }
  },

  onChange(evt) {
    let file = evt.target.files[0];
    if(file) {
      this.setState({ selectedFileName: file.name });
      this.props.onSelect(file);
    }
  },

  openFileDialog(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    click(this.refs.file);
  },

  render() {
    let postfix = this.state.selectedFileName ? ': ' + this.state.selectedFileName: '';
    return (
      <div>
        <button className="btn btn-default" onClick={this.openFileDialog}>
          {this.props.children}{postfix}
        </button>
        <input ref="file" type="file" style={{display: 'none'}} onChange={this.onChange} accept={this.props.accept}/>
      </div>
    );
  }
});

export default FileInput;
