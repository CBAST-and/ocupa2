// Formatea un Date como fecha legible en español, ignorando la zona horaria del dispositivo.
// Los date-pickers suelen devolver medianoche UTC para fechas "sin hora" (cumpleaños, fechas límite),
// así que forzamos timeZone: "UTC" para que el día mostrado sea siempre el que se seleccionó,
// sin importar el offset horario del dispositivo (en RD, UTC-4 restaba un día).
export function formatDateEs(date: Date): string {
  return new Intl.DateTimeFormat("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

// Convierte un Date a "YYYY-MM-DD" usando sus componentes UTC, por la misma razón de arriba.
export function toApiDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}