import type { DataRecord } from "src/lib/dataframe/dataframe";
import type { TRIGGERS } from "svelte-dnd-action";

export type Column = {
  id: string;
  records: DataRecord[];
};

export type OnRecordClick = (record: DataRecord) => void;
export type OnRecordAdd = (column: string) => void;
export type OnRecordDrop = (
  record: DataRecord,
  records: DataRecord[],
  trigger: DropTrigger
) => void;
export type DropTrigger =
  | TRIGGERS.DROPPED_INTO_ANOTHER
  | TRIGGERS.DROPPED_INTO_ZONE
  | TRIGGERS.DROPPED_OUTSIDE_OF_ANY;

export type OnRecordUpdate = (
  record: DataRecord,
  column: Column,
  trigger: RecordUpdateTrigger
) => void;

export type RecordUpdateTrigger = "addToColumn" | "removeFromColumn";

export type OnSortColumns = (names: string[]) => void;
export type OnSortRecords = (
  records: ReadonlyArray<DataRecord>
) => DataRecord[];

export type OnColumnAdd = (columns: string[], name: string) => void;
export type OnColumnDelete = (
  columns: string[],
  name: string,
  records: DataRecord[]
) => void;
