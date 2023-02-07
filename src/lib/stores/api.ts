import { derived } from "svelte/store";

import { DataApi } from "src/lib/data-api";
import { fileSystem } from "./fileSystem";

export const api = derived(
  fileSystem,
  ($fileSystem) => new DataApi($fileSystem)
);
