import * as React from "react";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/mode/python";
import "brace/theme/monokai";
import {block} from "../src/infix-lang";
import {parse} from "../src/parser-lib/parsers-m";
import {blockToJs} from "../src/infix-lang/expr-types/expr";


interface EditorState {
  code: string;
  outputCode: string;
}

export default class Editors extends React.Component<{}, EditorState> {

  state: EditorState = {
    code: 'def times(a, b) {\n  a * b\n}\nlet a = 6\na..times(b)',
    outputCode: ''
  };

  onCodeChange = (code: string) => {
    const t1 = +new Date();

    const ast = parse(block, `{${code}}`);

    if (ast) {
      const jsCode = blockToJs(ast, false);
      const beautify = require('js-beautify')['js_beautify'];

      this.setState({
        code: code,
        outputCode: beautify(jsCode)
      });
    }

    console.log(+new Date() - t1);
  };

  render() {
    return (
      <div className="editors">
        <div className="leftEditor">
          <AceEditor
            mode="python"
            theme="monokai"
            height="100%"
            width="100%"
            onChange={this.onCodeChange}
            name="leftEditor"
            editorProps={{$blockScrolling: true}}
            value={this.state.code}
          />
        </div>
        <div className="rightEditor">
          <AceEditor
            mode="javascript"
            theme="monokai"
            height="100%"
            width="100%"
            name="rightEditorId"
            editorProps={{$blockScrolling: true}}
            value={this.state.outputCode}
          />
        </div>
      </div>
    );
  }
}