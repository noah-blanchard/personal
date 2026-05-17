export const FORTUNES: string[] = [
  "premature optimization is the root of all evil — donald knuth",
  "a programmer is a machine for turning coffee into bugs",
  "there are two hard things in computer science: cache invalidation, naming things, and off-by-one errors",
  "weeks of programming can save you hours of planning",
  "the cheapest, fastest, and most reliable components are those that aren't there",
  "make it work, make it right, make it fast — in that order",
  "any code of your own that you haven't looked at for six or more months might as well have been written by someone else",
  "first, solve the problem. then, write the code",
  "talk is cheap. show me the code — linus",
  "if debugging is the process of removing bugs, then programming must be the process of putting them in",
  "computers are useless. they can only give you answers — picasso",
  "the best error message is the one that never shows up",
  "code never lies, comments sometimes do",
  "if it works, it's legacy",
  "in theory there is no difference between theory and practice. in practice there is",
];

export function randomFortune(): string {
  const idx = Math.floor(Math.random() * FORTUNES.length);
  return FORTUNES[idx] ?? FORTUNES[0]!;
}
