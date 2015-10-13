import React from 'react';

import {Container, Row} from '../common/layout';
import {GroupView} from './group-view';
import Icon from '../common/icon';

export const DatabaseView = ({ database }) => {
  return (
    <Container fluid >
      <Row>
        <Container>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon"><Icon name="search"/></div>
              <input type="search" className="form-control"/>
            </div>
          </div>
        </Container>
      </Row>
      <Row>
        <Container>
          <GroupView group={database.root}/>
        </Container>
      </Row>
    </Container>
  )
}
