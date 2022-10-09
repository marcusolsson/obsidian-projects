import { TFile, TFolder, Vault, type TAbstractFile } from "obsidian";
import os from "os";

/**
 * isTFile is a convenience function for filtering arrays of TAbstractFile.
 */
export function isTFile(value: TAbstractFile | null): value is TFile {
	return value instanceof TFile;
}

/**
 * isTFolder is a convenience function for filtering arrays of TAbstractFile.
 */
export function isTFolder(value: TAbstractFile | null): value is TFolder {
	return value instanceof TFolder;
}

export function getFilesInFolder(folder: TFolder): TFile[] {
	const result: TFile[] = [];
	Vault.recurseChildren(folder, (file) => {
		if (file instanceof TFile) {
			result.push(file);
		}
	});
	return result;
}

export function getNotesInFolder(folder: TFolder): TFile[] {
	return getFilesInFolder(folder).filter((file) => file.extension === "md");
}

export function getFoldersInFolder(folder: TFolder): TFolder[] {
	const result: TFolder[] = [];
	Vault.recurseChildren(folder, (file) => {
		if (file instanceof TFolder) {
			result.push(file);
		}
	});
	return result;
}

/**
 * isValidPath returns whether a file path is a valid file name depending on the
 * current OS.
 */
export function isValidPath(path: string): boolean {
	const illegalCharacters: Record<string, RegExp> = {
		darwin: /[\\\/\|\#\^\[\]]/,
		win32: /[\\\/\|\:\<\>\*\"\?]/,
	};

	const expr = illegalCharacters[os.platform()];

	if (!expr) {
		return true;
	}

	return !expr.test(path);
}
