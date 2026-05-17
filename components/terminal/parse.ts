export function parse(input: string): { name: string; args: string[] } {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const [name = "", ...args] = tokens;
  return { name: name.toLowerCase(), args };
}
