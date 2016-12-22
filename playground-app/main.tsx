import * as React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/mode/python';
import 'brace/theme/monokai';

function onChange(newValue) {
  console.log('change', newValue);
}

render(
  <div className="editors">
    <div className="leftEditor">
      <AceEditor
        mode="python"
        theme="monokai"
        height="100%"
        width="100%"
        onChange={onChange}
        name="leftEditor"
        editorProps={{$blockScrolling: true}}
        value="def myFunc (a, c) {\n  let a = 5\n  let b = 6\n  a..times(2)\n}"
      />
    </div>
    <div className="rightEditor">
      <AceEditor
        mode="javascript"
        theme="monokai"
        height="100%"
        width="100%"
        onChange={onChange}
        name="rightEditorId"
        editorProps={{$blockScrolling: true}}
      />
    </div>
  </div>,
  document.getElementById('content')
);