import React from 'react';

import {Dialog} from './dialog';

export const GroupDialog = React.createClass({
  update(field, evt) {
    const value = evt.target.value;
    this.props.group[field] = value;

    this.forceUpdate();
  },

  onOk(evt) {
    evt.preventDefault();

    this.props.onOk(this.props.group);
    this.props.onClose();
  },

  render() {
    return (
      <Dialog onClose={this.props.onClose}>
        <form className="form-horizontal">
          <div className="form-group">
            <label htmlFor="name-input">Name</label>
            <input autoComplete="false" type="text" className="form-control" id="name-input" value={this.props.group.name} onChange={this.update.bind(this, 'name')} placeholder="Name"/>
          </div>
          <div className="form-group">
            <label htmlFor="notes-input">Notes</label>
            <textarea autoComplete="false" className="form-control" id="notes-input" value={this.props.group.notes} onChange={this.update.bind(this, 'notes')} rows="3"></textarea>
          </div>
          <div className="form-group">
            <button className="btn btn-success btn-block" onClick={this.onOk}>Ok</button>
          </div>
        </form>
      </Dialog>
    )
  }
});
