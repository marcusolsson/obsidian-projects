import { derived } from "svelte/store";

import type { DataFrame } from "../data";
import { api } from "./api";
import { fileIndex } from "./file-index";

export const dataFrame = derived(
	[api, fileIndex],
	([$api, $fileIndex]): DataFrame => {
		return $api.createDataFrame($fileIndex.files);
	}
);
