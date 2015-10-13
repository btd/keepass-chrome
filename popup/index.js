//import { load } from '../common/io';
//import { Reader, Password } from 'keepass';

import React from 'react';
import ReactDOM from 'react-dom';

import Icon from '../common/icon';
import CredentialsForm from '../common/credentials-form';
import { Container } from '../common/layout';

import {Buffer} from 'buffer';

import {
  Password,
  KeyFile,
  DatabaseOptions,
  Database
} from 'keepass';

import { load } from '../common/io';
import { readFile } from '../common/read_file';
import { fromBuffer } from 'keepass';

import {DatabaseView} from './database-view';


const App = React.createClass({
  childContextTypes: {
    showDialog: React.PropTypes.func
  },

  getInitialState() {
    return {}
  },

  getChildContext() {
    return {
      showDialog: this.showDialog
    }
  },

  componentDidMount() {
    this.reloadDatabase()
  },

  reloadDatabase() {
    this.setState({ waiting: true })
    return loadBackground('database')
      .then(db => {
        if(db) {
          db.opts.protectedStreamKey = new Buffer(db.opts.protectedStreamKey)
          this.setState({
            waiting: false,
            database: Database.fromXml(db.xml, new DatabaseOptions(db.opts))
          })
          return db;
        } else
          return load()
            .then(file => {
              this.setState({
                waiting: false,
                rawDatabase: file
              })
            })
      })
  },

  tryOpenDatabase(_credentials) {
    let rawDatabase = this.state.rawDatabase;

    let cr = [];
    if(_credentials.password) cr.push(new Password(_credentials.password));

    let credPromise = _credentials.keyFile ?
      readFile(_credentials.keyFile)
        .then(f => {
          cr.push(new KeyFile(new Buffer(f.content)))
          return cr;
        })
      : Promise.resolve(cr);

    this.setState({ waiting: true });

    return credPromise
      .then(cr => fromBuffer(rawDatabase.content, cr))
      .then(db => {
        let dbOpts = DatabaseOptions.fromDatabase(db)
        let dbXml = Database.toXml(db, dbOpts);
        saveBackground('database', { xml: dbXml, opts: {
          compression: dbOpts.compression,
          transformRounds: dbOpts.transformRounds,
          cipher: dbOpts.cipher,
          protectedStreamKey: dbOpts.protectedStreamKey
        }});

        this.setState({ database: db, waiting: false });
      }, err => {
        console.error(err);
        this.setState({ openDatabaseError: err, waiting: false });
      })
  },

  closeDialog() {
    this.setState({ dialog: null });
  },

  showDialog(Type, props) {
    props.onClose = this.closeDialog;
    this.setState({ dialog: <Type {...props} /> });
  },

  render() {
    if(this.state.waiting)
      return (
        <Container className="center-child" >
          <Icon pulse name="spinner" size="4x"/>
        </Container>
      )

    if(this.state.dialog) return this.state.dialog;

    if(this.state.database)
      return <DatabaseView database={this.state.database}/>

    return (
      <Container className="center-child">
        <CredentialsForm onOk={this.tryOpenDatabase}/>
        { this.state.openDatabaseError &&
          <p className="text-danger">{this.state.openDatabaseError.message}</p>
        }
      </Container>
    )
  }
})

let id = 1;
function saveBackground(key, data) {
  port.postMessage({ id: id++, type: 'save session', key, data });
}

let waitCallback = {};

function loadBackground(key) {
  return new Promise(resolve => {
    loadBackground0(key, resolve);
  })
}

function loadBackground0(key, callback) {
  let msg = { id: id++, type: 'load session', key};
  waitCallback[msg.id] = callback;
  port.postMessage(msg);
}

var port = chrome.runtime.connect();
port.onMessage.addListener(function(msg) {
  let callback = waitCallback[msg.id];
  callback(msg.result);
  delete waitCallback[id];
});

ReactDOM.render(<App/>, document.getElementById('app'));
