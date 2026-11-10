import type { SabitKiymet } from '../types/sabitKiymet.types';

const BASE_URL = 'http://localhost:3001';

export async function getSabitKiymetler(): Promise<SabitKiymet[]> {
  const res = await fetch(`${BASE_URL}/sabitKiymetler`);
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  return res.json();
}

export async function deleteSabitKiymet(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/sabitKiymetler/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
}