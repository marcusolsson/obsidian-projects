import { parse, stringify } from "yaml";

export function parseData(data: string): Record<string, any> {
  return parse(data);
}

export function stringifyData(value: any): string {
  const val = stringify(value);

  const re = /^(.*):\s*"(.*)"/gm;

  return val.replace(re, (_match, p1, p2) => {
    return p1 + ": " + p2;
  });
}
