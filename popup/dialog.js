import React from 'react';

import {Container} from '../common/layout';
import Icon from '../common/icon';

export const Dialog = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <Container className="center-child dialog">
        <button type="button" onClick={this.props.onClose} className="close" data-dismiss="modal" aria-label="Close">
          <Icon name="times"/>
        </button>
        {this.props.children}

      </Container>
    );
  }
});
