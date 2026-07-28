/**
 * Normaliza un número de teléfono boliviano para uso en links de WhatsApp.
 * Acepta el número con o sin prefijo 591, con espacios, guiones o "+",
 * y siempre devuelve solo los 7-8 dígitos locales (sin código de país).
 */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  // Si viene con el prefijo de país (591) y tiene más de 8 dígitos, lo sacamos
  if (digits.startsWith("591") && digits.length > 8) {
    digits = digits.slice(3);
  }

  return digits;
}

/**
 * Arma el link de WhatsApp (wa.me) a partir de un número boliviano,
 * normalizando el prefijo de país para evitar duplicados.
 */
export function whatsappLink(rawPhone: string, message?: string): string {
  const local = normalizePhone(rawPhone);
  const base = `https://wa.me/591${local}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
