// Image registry for the RGCC exercise library.
// Importing as URL via `?url` keeps assets fingerprinted by Vite without
// pulling them into JS bundles. Other clubs can declare their own registry
// in the future and the UI will resolve images via this lookup helper.

import ex1 from "./assets/exercises/ex-1.jpg?url";
import ex2 from "./assets/exercises/ex-2.jpg?url";
import ex3 from "./assets/exercises/ex-3.jpg?url";
import ex4 from "./assets/exercises/ex-4.jpg?url";
import ex5 from "./assets/exercises/ex-5.jpg?url";
import ex6 from "./assets/exercises/ex-6.jpg?url";
import ex7 from "./assets/exercises/ex-7.jpg?url";
import ex8 from "./assets/exercises/ex-8.jpg?url";
import ex9 from "./assets/exercises/ex-9.jpg?url";
import ex10 from "./assets/exercises/ex-10.jpg?url";
import ex11 from "./assets/exercises/ex-11.jpg?url";
import ex12 from "./assets/exercises/ex-12.jpg?url";
import ex13 from "./assets/exercises/ex-13.jpg?url";
import ex14 from "./assets/exercises/ex-14.jpg?url";
import ex15 from "./assets/exercises/ex-15.jpg?url";
import ex16 from "./assets/exercises/ex-16.jpg?url";

import evAterrizaje from "./assets/exercises-ev/ev-aterrizaje-bilateral.jpg?url";
import evBlunder from "./assets/exercises-ev/ev-blunder-check.jpg?url";
import evCircuito from "./assets/exercises-ev/ev-circuito-adaptado.jpg?url";
import evCopen from "./assets/exercises-ev/ev-copenhagen-plank.jpg?url";
import evEquilibrio from "./assets/exercises-ev/ev-equilibrio-tobillo.jpg?url";
import evFrenada from "./assets/exercises-ev/ev-frenada-reactiva.jpg?url";
import evHipHinge from "./assets/exercises-ev/ev-hip-hinge.jpg?url";
import evIsoCervical from "./assets/exercises-ev/ev-isometria-cervical.jpg?url";
import evLanzamiento from "./assets/exercises-ev/ev-lanzamiento-rotacional.jpg?url";
import evNordic from "./assets/exercises-ev/ev-nordic-hamstring.jpg?url";
import evPallof from "./assets/exercises-ev/ev-pallof-press.jpg?url";
import evPausa from "./assets/exercises-ev/ev-pausa-cervical.jpg?url";
import evRemo from "./assets/exercises-ev/ev-remo-banda.jpg?url";
import evRespiracion from "./assets/exercises-ev/ev-respiracion-cd.jpg?url";
import evRotadores from "./assets/exercises-ev/ev-rotadores-banda.jpg?url";
import evSentadilla from "./assets/exercises-ev/ev-sentadilla-caja.jpg?url";
import evSkipping from "./assets/exercises-ev/ev-skipping-tecnico.jpg?url";
import evSplit from "./assets/exercises-ev/ev-split-step.jpg?url";
import evUkemi from "./assets/exercises-ev/ev-ukemi.jpg?url";

export const RGCC_EXERCISE_IMAGES: Record<string, string> = {
  "ex-1": ex1,
  "ex-2": ex2,
  "ex-3": ex3,
  "ex-4": ex4,
  "ex-5": ex5,
  "ex-6": ex6,
  "ex-7": ex7,
  "ex-8": ex8,
  "ex-9": ex9,
  "ex-10": ex10,
  "ex-11": ex11,
  "ex-12": ex12,
  "ex-13": ex13,
  "ex-14": ex14,
  "ex-15": ex15,
  "ex-16": ex16,
  "ev-aterrizaje-bilateral": evAterrizaje,
  "ev-blunder-check": evBlunder,
  "ev-circuito-adaptado": evCircuito,
  "ev-copenhagen-plank": evCopen,
  "ev-equilibrio-tobillo": evEquilibrio,
  "ev-frenada-reactiva": evFrenada,
  "ev-hip-hinge": evHipHinge,
  "ev-isometria-cervical": evIsoCervical,
  "ev-lanzamiento-rotacional": evLanzamiento,
  "ev-nordic-hamstring": evNordic,
  "ev-pallof-press": evPallof,
  "ev-pausa-cervical": evPausa,
  "ev-remo-banda": evRemo,
  "ev-respiracion-cd": evRespiracion,
  "ev-rotadores-banda": evRotadores,
  "ev-sentadilla-caja": evSentadilla,
  "ev-skipping-tecnico": evSkipping,
  "ev-split-step": evSplit,
  "ev-ukemi": evUkemi,
};

export function getRgccExerciseImage(id: string): string | undefined {
  return RGCC_EXERCISE_IMAGES[id];
}
