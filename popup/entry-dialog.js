import React from 'react';

import Icon from '../common/icon';
import {Dialog} from './dialog';

const Input = ({id, type = 'text', value = '', onChange, placeholder = '', tag = 'input', label}) => {
  let _tag = tag;
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <_tag type={type} autoComplete="false" className="form-control" id={id} value={value} onChange={onChange} placeholder={placeholder}/>
    </div>
  )
}

const defaultAttrProps = {
  'Notes': {
    tag: 'textarea'
  },
  'Url': {
    type: 'url'
  }
}

const ProtectedInput = React.createClass({

  getDefaultProps() {
    return {
      type: "text",
      protected: true,
      value: ''
    }
  },

  getInitialState() {
    return {
      protected: this.props.protected
    }
  },

  toggleProtection() {
    this.setState({ protected: !this.state.protected });
  },

  render() {
    let _protected = this.state.protected;
    let {
      value,
      onChange,
      id,
      label,
      type
    } = this.props;
    return (
      <div className="form-group">
        {label && <label htmlFor={id}>{label}</label>}
        <div className="input-group">
          <input id={id} type={_protected? "password": type} className="form-control" value={value} onChange={onChange}/>
          <div className="input-group-addon" onClick={this.toggleProtection}><Icon name={_protected ? "eye": "eye-slash" }/></div>
        </div>
      </div>
    )
  }
})

export const EntryDialog = React.createClass({
  update(field, evt) {
    const value = evt.target.value;
    this.props.entry.set(field, value);

    this.forceUpdate();
  },

  onOk(evt) {
    evt.preventDefault();

    this.props.onOk(this.props.entry);
    this.props.onClose();
  },

  render() {
    let entry = this.props.entry;
    //TODO for password need something better then text or password input
    return (
      <Dialog onClose={this.props.onClose}>
        <form className="form-horizontal">
          {
            entry.attributes.map((attr) => {
              let key = attr.key;
              let props = defaultAttrProps[key] || {};
              props.value = attr.value;//TODO protected
              props.id = "string-"+key;
              props.label = key;
              props.key = key;
              props.onChange = this.update.bind(this, key);
              if(attr.protected)
                return <ProtectedInput {...props}/>
              else
                return <Input {...props}/>
            })
          }
          <div className="form-group">
            <button className="btn btn-success btn-block" onClick={this.onOk}>Ok</button>
          </div>
        </form>
      </Dialog>
    )
  }
})
