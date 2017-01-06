import * as React from "react";
import AceEditor from "react-ace";
import "brace/mode/javascript";
import "brace/mode/python";
import "brace/theme/monokai";
import {parse} from "../src/parser-lib/parsers-m";
import {blockToJs} from "../src/infix-lang/expr-types/expr";
import {exprs} from "../src/infix-lang";


interface EditorState {
  code: string;
  outputCode: string;
}

function transpileCode(code: string): string {
  const ast = parse(exprs, code);

  if (ast) {
    const jsCode = blockToJs(ast, false);
    const beautify = require('js-beautify')['js_beautify'];

    return beautify(jsCode);
  }
  return '';
}

export default class Editors extends React.Component<{}, EditorState> {

  state: EditorState = {
    code: 'def times(a, b) {\n  a * b\n}\nlet a = 6\na..times(b)',
    outputCode: ''
  };

  onCodeChange = (code: string) => {
    const t1 = +new Date();
    const jsCode = transpileCode(code);

    if (jsCode) {
      this.setState({
        code: code,
        outputCode: jsCode
      });
    }
    localStorage.setItem('code', code);

    console.log(+new Date() - t1);
  };

  componentDidMount() {
    const code = localStorage.getItem('code');
    if (code) {
      const jsCode = transpileCode(code);
      this.setState({
        code: code,
        outputCode: jsCode
      });
    }
  }

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