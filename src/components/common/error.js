import React, { Fragment } from 'react';

function Error(props) {
  const error = props.msg;
  return <Fragment>{<p>{error}</p>}</Fragment>;
}

export default Error;