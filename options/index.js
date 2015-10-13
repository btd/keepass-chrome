import React from 'react';
import ReactDOM from 'react-dom';
import {Buffer} from 'buffer';

import {
  generateKey,
  toBuffer,
  Database,
  Password,
  KeyFile
} from 'keepass';

import Icon from '../common/icon';
import CredentialsForm from '../common/credentials-form';
import { Col, Row, Container } from '../common/layout';
import FileInput from '../common/file-input';

import { save, load } from '../common/io';
import { readFile } from '../common/read_file';




const KeyGenOption = React.createClass({
  getInitialState() {
    return {};
  },

  getDefaultProps() {
    return {
      fileName: 'keepass.key',
      destroyTimeout: 2000
    }
  },

  beginKeyGeneration() {
        //do not create tons of urls, clean if we have one already
    if(this.state.keyUrl) {
      URL.revokeObjectURL(this.state.keyUrl);
    }

    this.setState({ generatingKey: true });

    return generateKey()
      .then((key) => {
        let blob = new Blob([key], { type: 'text/xml' });
        let url = URL.createObjectURL(blob);
        this.setState({ generatingKey: false, keyUrl: url });
      })
  },

  releaseUrl() {
    let url = this.state.keyUrl;
    this.setState({ keyUrl: null }, () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, this.props.destroyTimeout);
    });
  },

  render() {
    return (
      <Row>
        <Col type="xs" size="5">
          <button
            className="btn btn-primary"
            onClick={this.beginKeyGeneration}
            disabled={!!this.state.generatingKey}
          >
              Generate new key
          </button>
        </Col>
        <Col type="xs" size="5">
          {
            this.state.generatingKey ?
              <Icon pulse name="spinner" size="2x"/>:
              this.state.keyUrl &&
                <a
                  href={this.state.keyUrl}
                  download={this.props.fileName}
                  onClick={this.releaseUrl}
                  className="btn btn-link"
                >
                  Download key
                </a>
          }
        </Col>
      </Row>
    );
  }
});

const DatabaseOption = React.createClass({
  getInitialState() {
    return {};
  },

  render() {

    return (
      <Row>
        <Col type="xs" size="5">
          <button
            className="btn btn-primary"
            onClick={this.props.onCreate}>
              Create new database
          </button>
        </Col>
        <Col type="xs" size="5">
          <FileInput
            accept=".kdbx"
            onSelect={this.props.onUpload}>
              Upload
          </FileInput>
        </Col>
      </Row>
    );
  }
})

const Options = React.createClass({
  getInitialState() {
    return {
      showNewDatabaseForm: false,
      loadingDatabase: true,
      database: null
    };
  },

  toggleCreatenewDatabase() {
    this.setState({ showNewDatabaseForm: !this.state.showNewDatabaseForm })
  },

  createNewDatabase(data) {
    this.toggleCreatenewDatabase();

    let db = new Database();
    let cr = [];
    if(data.password) cr.push(new Password(data.password));

    let credPromise = data.keyFile ?
      readFile(data.keyFile)
        .then(f => {
          cr.push(new KeyFile(new Buffer(f.content)))
          return cr;
        })
      : Promise.resolve(cr);

    return credPromise
      .then(cr => toBuffer(db, cr))
      .then(buf => {
        let db = { name: 'keepass.kdbx', content: buf };
        this.setDatabase(db);
        return save(db);
      })
  },

  componentDidMount() {
    return load()
      .then((db) => {
        this.setDatabase(db);
      })
  },

  setDatabase(db) {
    this.setState({
      loadingDatabase: false,
      uploadingDatabase: false,
      database: db || null,
      databaseUrl: db && URL.createObjectURL(new Blob([db.content])) || null
    })
  },

  saveUploaded(file) {
    this.setState({ uploadingDatabase: true });
    return readFile(file)
      .then(db => {
        this.setDatabase(db);
        return save(db);
      })
  },

  render() {

    return (
      <Container fluid >
        <KeyGenOption/>
        <hr/>
        {
          this.state.uploadingDatabase &&
            <Icon pulse name="spinner" size="2x"/>
        }
        {
          !this.state.showNewDatabaseForm && !this.state.uploadingDatabase &&
            <DatabaseOption
              onCreate={this.toggleCreatenewDatabase}
              onUpload={this.saveUploaded}/>
        }
        {
          this.state.showNewDatabaseForm &&
            <CredentialsForm
              onCancel={this.toggleCreatenewDatabase}
              onOk={this.createNewDatabase}/>
        }
        <hr/>
        <div>
          {
            this.state.loadingDatabase &&
              <Icon pulse name="spinner" size="2x"/>
          }
          {
            !this.state.loadingDatabase && !this.state.database &&
              <span>Need to add database</span>
          }
          {
            !this.state.loadingDatabase && this.state.database &&
              <a
                href={this.state.databaseUrl}
                download={this.state.database.name}
                className="btn btn-link">Download database</a>
          }
        </div>
      </Container>
    );
  }
});

ReactDOM.render(<Options/>, document.getElementById('app'));
