import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  deleteSabitKiymet,
  getSabitKiymetler,
} from '../../../api/sabitKiymet.api';
import Notification from '../../../components/Notification';
import {
  DURUM_LABEL,
  DURUM_OPTIONS,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  type Durum,
  type Kategori,
  type SabitKiymet,
} from '../../../types/sabitKiymet.types';
import { formatPara, formatTarih } from '../../../utils/_project/sabitKiymet';
import SabitKiymetCard from '../card/SabitKiymetCardTemp';
import './SabitKiymetList.scss';

type KategoriFilter = Kategori | 'ALL';
type DurumFilter = Durum | 'ALL';

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

function SabitKiymetList() {
  const [items, setItems] = useState<SabitKiymet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationState>(null);

  const [search, setSearch] = useState<string>('');
  const [kategoriFilter, setKategoriFilter] = useState<KategoriFilter>('ALL');
  const [durumFilter, setDurumFilter] = useState<DurumFilter>('ALL');
  const [hizliEkleOpen, setHizliEkleOpen] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  const loadItems = async () => {
    try {
      const data = await getSabitKiymetler();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const state = location.state as
      | { message?: string; type?: 'success' | 'error' }
      | null;
    if (state?.message) {
      setNotification({
        message: state.message,
        type: state.type ?? 'success',
      });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(t);
  }, [notification]);

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Bu kaydı silmek istediğinize emin misiniz?');
    if (!ok) return;

    try {
      await deleteSabitKiymet(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setNotification({ message: 'Kayıt silindi', type: 'success' });
    } catch {
      setNotification({ message: 'Silme işlemi başarısız', type: 'error' });
    }
  };

  const handleHizliEkleSaved = async () => {
    setHizliEkleOpen(false);
    setNotification({ message: 'Kayıt eklendi', type: 'success' });
    await loadItems(); 
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.ad
      .toLocaleLowerCase('tr-TR')
      .includes(search.toLocaleLowerCase('tr-TR'));
    const matchesKategori =
      kategoriFilter === 'ALL' || item.kategori === kategoriFilter;
    const matchesDurum = durumFilter === 'ALL' || item.durum === durumFilter;
    return matchesSearch && matchesKategori && matchesDurum;
  });

  if (loading) return <p>Yükleniyor…</p>;

  if (error) {
    return (
      <div className="sabit-kiymet-list">
        <div className="sabit-kiymet-list__error">
          <p>Hata: {error}</p>
          <button
            className="btn btn--secondary"
            onClick={() => window.location.reload()}
          >
            Yeniden dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sabit-kiymet-list">
      <div className="sabit-kiymet-list__header">
        <h1>Sabit Kıymetler</h1>
        <div className="sabit-kiymet-list__header__actions">
          <button
            className="btn btn--secondary"
            onClick={() => setHizliEkleOpen(true)}
          >
            + Hızlı Ekle
          </button>
          <Link to="/sabit-kiymet/yeni" className="btn btn--primary">
            + Yeni
          </Link>
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="sabit-kiymet-list__filters">
        <input
          type="text"
          placeholder="Ad ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value as KategoriFilter)}
        >
          <option value="ALL">Tüm kategoriler</option>
          {KATEGORI_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={durumFilter}
          onChange={(e) => setDurumFilter(e.target.value as DurumFilter)}
        >
          <option value="ALL">Tüm durumlar</option>
          {DURUM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <div className="sabit-kiymet-list__empty">
          <p>Henüz hiç kayıt yok.</p>
          <Link to="/sabit-kiymet/yeni" className="btn btn--primary">
            İlk kaydı ekle
          </Link>
        </div>
      ) : (
        <div className="sabit-kiymet-list__table-wrapper">
          <table className="sabit-kiymet-list__table">
            <thead>
              <tr>
                <th>Ad</th>
                <th>Kategori</th>
                <th>Durum</th>
                <th>Alış Tarihi</th>
                <th>Alış Bedeli</th>
                <th>Şube</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    Arama/filtre kriterlerine uyan kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.ad}</td>
                    <td>{KATEGORI_LABEL[item.kategori]}</td>
                    <td>{DURUM_LABEL[item.durum]}</td>
                    <td>{formatTarih(item.alisTarihi)}</td>
                    <td>{formatPara(item.alisBedeli)}</td>
                    <td>{item.subeAdi || '—'}</td>
                    <td>
                      <div className="sabit-kiymet-list__table__actions">
                        <Link
                          to={`/sabit-kiymet/${item.id}`}
                          className="btn btn--ghost"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn btn--danger"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {hizliEkleOpen && (
        <div
          className="modal-overlay"
          onClick={() => setHizliEkleOpen(false)}
        >
          <div
            className="modal-content modal-content--wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Hızlı Ekle</h2>
              <button
                className="btn btn--ghost"
                onClick={() => setHizliEkleOpen(false)}
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            <SabitKiymetCard
              isInModal
              onSaved={handleHizliEkleSaved}
              onCancel={() => setHizliEkleOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SabitKiymetList;