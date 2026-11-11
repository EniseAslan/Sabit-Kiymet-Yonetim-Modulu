import type { Sube } from '../types/sube.types';

const BASE_URL = 'http://localhost:3001';

export async function getSubeler(): Promise<Sube[]> {
  const res = await fetch(`${BASE_URL}/subeler`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}