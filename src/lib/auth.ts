import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
export function makeSession() { const time = String(Date.now()+7*24*3600*1000); return `${time}.${createHmac('sha256',secret()).update(time).digest('hex')}`; }
export async function isAdmin() { if (!process.env.ADMIN_PASSWORD || !secret()) return false; const token = (await cookies()).get('uliyil_admin')?.value || ''; const [time,signature] = token.split('.'); if (!time || !signature || Number(time)<Date.now()) return false; const expected = createHmac('sha256',secret()).update(time).digest('hex'); try { return timingSafeEqual(Buffer.from(signature),Buffer.from(expected)); } catch { return false; } }
export function validPassword(input:string) { const password = process.env.ADMIN_PASSWORD; if (!password || !input) return false; const a=createHmac('sha256','admin-login').update(input).digest(); const b=createHmac('sha256','admin-login').update(password).digest(); return timingSafeEqual(a,b); }
