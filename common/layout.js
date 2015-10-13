import React from 'react';

import cx from 'classnames';

export const Col = ({type, size, children}) => {
  return <div className={'col-'+type+'-'+size}>{children}</div>;
};

export const Row = ({children}) => <div className="row">{children}</div>;

export const Container = ({children, fluid = false, className = ''}) =>
  <div className={cx(className, { "container": !fluid, "container-fluid": fluid })}>{children}</div>;
