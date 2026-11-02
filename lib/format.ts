// Fixed time zone: the server (often UTC) and the browser must render the same
// string, otherwise React reports a hydration mismatch.
const formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export const formatDate = (ms: number) => formatter.format(ms);