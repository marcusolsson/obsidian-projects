import os from "os";

export function isValidPath(path: string) {
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
