// Holidays quest mode can dress up for: Settings -> Extras -> Holidays. Each has
// a theme -- only holidays whose theme exists are listed -- and a window:
//   month: N            a big holiday: the whole month
//   date: [m, d]        a smaller one: from the Monday two weeks before, to `end` (or the day)
//   after: id           ...but not before that holiday's window is over
// A new holiday is a new line, once its theme exists. First match wins.
export const HOLIDAYS = [
  { id: "halloween", name: "Halloween", theme: "halloween", month: 10 },
  { id: "muertos", name: "Día de los Muertos", theme: "muertos", date: [11, 1], end: [11, 2], after: "halloween" },
];
