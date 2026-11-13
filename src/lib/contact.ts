/** Formats a phone number into a clickable tel: href. */
export function formatTelHref(raw: string): string {
  return `tel:${raw.replace(/[^\d+]/g, '')}`;
}

/** Formats a phone/WhatsApp number into a valid wa.me chat URL (defaults 10-digit numbers to India +91). */
export function formatWhatsAppUrl(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return `https://wa.me/${digits}`;
}
