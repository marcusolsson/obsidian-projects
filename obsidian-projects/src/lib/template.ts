export function interpolateTemplate(
	template: string,
	data: Record<string, (arg?: string) => string>
): string {
	return template.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, name) => {
		const [func, arg] = name.split(/:(.*)/s);
		const f = data[func];
		return f ? f(arg) : "";
	});
}
