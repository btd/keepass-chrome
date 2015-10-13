import React from 'react';
import cx from 'classnames';

const Icon = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    animated: React.PropTypes.bool,
    pulse: React.PropTypes.bool,
    size: React.PropTypes.string,
    fixed: React.PropTypes.bool,
    large: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      type: 'fa',
      animated: false,
      pulse: false,
      fixed: false,
      large: false
    };
  },

  render() {
    let {
      className,
      type
    } = this.props;
    return <span
      className={
        cx(
          type,
          type + '-' + this.props.name,
          {
            [type + '-spin']: this.props.animated,
            [type + '-pulse']: this.props.pulse,
            [type + '-' + this.props.size]: !!this.props.size,
            [type + '-fw']: !!this.props.fixed,
            [type + '-lg']: !!this.props.large
          },
          className
        )
      }
      aria-hidden="true"/>;
  }
});

export default Icon;
