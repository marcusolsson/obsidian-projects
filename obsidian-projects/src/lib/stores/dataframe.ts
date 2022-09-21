import { derived } from "svelte/store";

import type { DataFrame } from "../types";
import { api } from "./api";
import { fileIndex } from "./file-index";

export const dataFrame = derived(
	[api, fileIndex],
	([$api, $fileIndex]): DataFrame => {
		return $api.createDataFrame($fileIndex.files);
	}
);
