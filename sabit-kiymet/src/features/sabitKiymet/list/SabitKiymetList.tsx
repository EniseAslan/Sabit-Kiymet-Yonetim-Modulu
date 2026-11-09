import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSabitKiymetler } from '../../../api/sabitKiymet.api';
import type { SabitKiymet } from '../../../types/sabitKiymet.types';

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
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/sabit-kiymet/${item.id}`}>{item.ad}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SabitKiymetList;