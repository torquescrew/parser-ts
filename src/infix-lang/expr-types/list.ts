import {Expr, ETypes} from "./expr";


export interface List extends Expr {
  values: Expr[];
}

// export function mkList2(res) {
//   return {
//     type: ETypes.List,
//     values: res[1]
//   };
// }

export const mkList = (res) => ({
  type: ETypes.List,
  values: res[1]
});