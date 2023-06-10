import produce from "immer";
import type { DataField } from "src/lib/dataframe/dataframe";

export function sortFields(fields: DataField[], order: string[]) {
  if (!order.length) {
    return fields;
  }

  const test = produce(fields, (draft) => {
    draft.sort((left, right) => {
      if (!order.includes(left.name)) {
        return 1;
      }
      if (!order.includes(right.name)) {
        return -1;
      }
      return order.indexOf(left.name) - order.indexOf(right.name);
    });
  });

  return test;
}
