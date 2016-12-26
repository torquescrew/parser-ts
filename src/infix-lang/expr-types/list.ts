import {Expr, ETypes, toJs} from "./expr";


export interface List extends Expr {
  values: Expr[];
}

export const mkList = (res) => ({
  type: ETypes.List,
  values: res[1]
});


export function listToJs(list: List): string {
  const values = list.values.map(toJs).join(', ');

  return `[${values}]`;
}


export interface IndexIntoList extends Expr {
  list: Expr;
  index: number;
}

export function mkIndexIntoList(res): IndexIntoList {
  return {
    type: ETypes.IndexIntoList,
    list: res[0],
    index: res[2]
  };
}

export function indexIntoListToJs(iil: IndexIntoList) {
  return `${toJs(iil.list)}[${toJs(iil.index)}]`;
}