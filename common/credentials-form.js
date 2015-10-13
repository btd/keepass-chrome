import React from 'react';

import FileInput from './file-input';
import cx from 'classnames';

const CredentialsForm = React.createClass({
  getInitialState() {
    return {};
  },

  setPassword(evt) {
    this.setState({ newPassword: evt.target.value })
  },

  setKeyFile(file) {
    this.setState({ newKeyFile: file })
  },

  toggleUsePassword() {
    this.setState({ usePassword: !this.usePassword() })
  },

  toggleUseKeyFile() {
    this.setState({ useKeyFile: !this.useKeyFile() })
  },

  usePassword() {
    return this.state.usePassword != null ? this.state.usePassword : !!this.state.newPassword
  },

  useKeyFile() {
    return this.state.useKeyFile != null ? this.state.useKeyFile : !!this.state.newKeyFile
  },

  onOk(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let data = {};
    if(this.usePassword()) data.password = this.state.newPassword;
    if(this.useKeyFile()) data.keyFile = this.state.newKeyFile;

    if(data.password || data.keyFile) {
      this.props.onOk(data);
    }
  },

  onCancel(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.props.onCancel();
  },

  checkIfEnterPressed(evt) {
    if(evt.key === 'Enter') {
      this.onOk(evt);
    }
  },

  render() {
    let buttonClasses = cx('btn', 'btn-success', { 'btn-block' : !this.props.onCancel});
    return (
      <form className="container credentials-form">
        <div className="form-group row">
          <input
            id="password"
            placeholder="Password"
            className="form-control"
            type="password"
            autoFocus
            onKeyDown={this.checkIfEnterPressed}
            onChange={this.setPassword}/>
        </div>
        <div className="checkbox row">
          <label>
            <input type='checkbox' checked={this.usePassword()} onChange={this.toggleUsePassword}/>
            Use password
          </label>
        </div>
        <div className="form-group row">
          <FileInput onSelect={this.setKeyFile}>Key file</FileInput>
        </div>
        <div className="checkbox row">
          <label>
            <input type='checkbox' checked={this.useKeyFile()} onChange={this.toggleUseKeyFile}/>
            Use key file
          </label>
        </div>
        <div className="form-group row">
          <button className={buttonClasses} onClick={this.onOk}>Ok</button>
          { this.props.onCancel && <button className="btn btn-default pull-right" onClick={this.onCancel}>Cancel</button>}
        </div>
      </form>
    );
  }
});

export default CredentialsForm;
