import {IInputData} from "../../input";


export function handleFail(inputData: IInputData, extra) {
  const pos = inputData.position;

  if (extra && extra['parserIndex'] > 1) {
    console.log('Error: Expected identifier, found:', inputData.code.slice(pos, pos + 20));
  }
}

export function handleSuccess(res) {
  const identifier = res[1];
  const value = res[3];

  return {
    type: 'def-var',
    identifier: identifier,
    value: value
  };
}
