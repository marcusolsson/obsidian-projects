import { derived } from "svelte/store";

import { DataApi } from "src/lib/dataApi";
import { fileSystem } from "./fileSystem";

export const api = derived(
  fileSystem,
  ($fileSystem) => new DataApi($fileSystem)
);
