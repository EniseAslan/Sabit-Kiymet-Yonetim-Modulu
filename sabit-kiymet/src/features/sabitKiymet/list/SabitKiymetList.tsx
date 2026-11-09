import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSabitKiymetler } from '../../../api/sabitKiymet.api';
import {
  DURUM_LABEL,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  type SabitKiymet,
} from '../../../types/sabitKiymet.types';

function SabitKiymetList() {
  const [items, setItems] = useState<SabitKiymet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSabitKiymetler();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <h1>Sabit Kıymetler</h1>
      <Link to="/sabit-kiymet/yeni">Yeni</Link>

      <select>
        {KATEGORI_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/sabit-kiymet/${item.id}`}>{item.ad}</Link>
            {' — '}
            {KATEGORI_LABEL[item.kategori]} · {DURUM_LABEL[item.durum]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SabitKiymetList;