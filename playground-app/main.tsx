import * as React from 'react';
import { render } from 'react-dom';
import Editors from './editors';

function onChange(newValue) {
  console.log('change', newValue);
}

render(
  <Editors />,
  document.getElementById('content')
);