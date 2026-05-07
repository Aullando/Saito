export const formatName = (first: string, last: string) =>
  `${first} ${last.toUpperCase()}`;

export const formatDateTime = (input: string | Date) => {
  const d = typeof input === "string" ? new Date(input) : input;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
};

export const formatDate = (input: string | Date) => {
  const d = typeof input === "string" ? new Date(input) : input;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

export const formatTime = (input: string | Date) => {
  const d = typeof input === "string" ? new Date(input) : input;
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export const formatMoneyEs = (n: number) =>
  new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " €";
