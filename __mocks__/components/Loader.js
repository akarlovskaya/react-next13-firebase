// __mocks__/components/Loader.js
import React from "react";
const MockSpinner = ({ show }) =>
  show ? <div data-testid="spinner">Loading...</div> : null;
export default MockSpinner;
