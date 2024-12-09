import React from 'react';

export default function Spinner({ show }) {
  return show ? <div className="loader"></div> : null;
}
