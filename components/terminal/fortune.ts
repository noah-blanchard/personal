import type { Locale, Localized } from "@/content/types";

export const FORTUNES: Localized<string[]> = {
  en: [
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
  ],
  fr: [
    "l'optimisation prématurée est la racine de tous les maux — donald knuth",
    "un·e programmeur·euse est une machine qui transforme le café en bugs",
    "il y a deux choses difficiles en info : l'invalidation du cache, nommer les choses, et les erreurs de plus-ou-moins-un",
    "des semaines de code peuvent t'épargner des heures de planification",
    "les composants les moins chers, les plus rapides et les plus fiables sont ceux qui ne sont pas là",
    "fais que ça marche, fais que ce soit juste, fais que ce soit rapide — dans cet ordre",
    "tout code à toi que tu n'as pas relu depuis plus de six mois pourrait aussi bien avoir été écrit par quelqu'un d'autre",
    "d'abord, résous le problème. ensuite, écris le code",
    "parler ne coûte rien. montre-moi le code — linus",
    "si déboguer, c'est enlever des bugs, alors programmer doit être les mettre",
    "les ordinateurs sont inutiles. ils ne peuvent que donner des réponses — picasso",
    "le meilleur message d'erreur est celui qui n'apparaît jamais",
    "le code ne ment jamais, les commentaires parfois si",
    "si ça marche, c'est legacy",
    "en théorie il n'y a pas de différence entre la théorie et la pratique. en pratique, si",
  ],
};

export function randomFortune(locale: Locale): string {
  const list = FORTUNES[locale];
  const idx = Math.floor(Math.random() * list.length);
  return list[idx] ?? list[0]!;
}
