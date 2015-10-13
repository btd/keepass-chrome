import React from 'react';

import {Dialog} from './dialog';

export const ConfirmDialog = React.createClass({
  onResult(result, evt) {
    evt.preventDefault();

    this.props.onResult(result);
    this.props.onClose();
  },

  render() {
    return (
      <Dialog onClose={this.props.onClose}>
        <form className="form-horizontal">
          <h3>Are you sure?</h3>
          <div className="form-group">
            <button className="btn btn-danger pull-left" onClick={this.onResult.bind(this, true)}>Yes</button>
            <button className="btn btn-default pull-right" onClick={this.onResult.bind(this, false)}>No</button>
          </div>
        </form>
      </Dialog>
    )
  }
});
