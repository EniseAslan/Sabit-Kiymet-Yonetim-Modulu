import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteSabitKiymet,
  getSabitKiymetler,
} from "../../../api/sabitKiymet.api";
import Notification from "../../../components/Notification";
import {
  DURUM_LABEL,
  DURUM_OPTIONS,
  KATEGORI_LABEL,
  KATEGORI_OPTIONS,
  type Durum,
  type Kategori,
  type SabitKiymet,
} from "../../../types/sabitKiymet.types";

type KategoriFilter = Kategori | "ALL";
type DurumFilter = Durum | "ALL";

function SabitKiymetList() {
  const [items, setItems] = useState<SabitKiymet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [kategoriFilter, setKategoriFilter] = useState<KategoriFilter>("ALL");
  const [durumFilter, setDurumFilter] = useState<DurumFilter>("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSabitKiymetler();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(t);
  }, [notification]);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bu kaydı silmek istediğinize emin misiniz?");
    if (!ok) return;

    try {
      await deleteSabitKiymet(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setNotification("Kayıt silindi");
    } catch {
      window.alert("Silme işlemi başarısız.");
    }
  };

  const filtered = items.filter((item) => {
    const matchesSearch = item.ad
      .toLocaleLowerCase("tr-TR")
      .includes(search.toLocaleLowerCase("tr-TR"));
    const matchesKategori =
      kategoriFilter === "ALL" || item.kategori === kategoriFilter;
    const matchesDurum = durumFilter === "ALL" || item.durum === durumFilter;
    return matchesSearch && matchesKategori && matchesDurum;
  });

  if (loading) return <p>Yükleniyor…</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <h1>Sabit Kıymetler</h1>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <div>
        <Link to="/sabit-kiymet/yeni">Yeni</Link>

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

      <table>
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
              <td colSpan={7}>Kayıt bulunamadı.</td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.ad}</td>
                <td>{KATEGORI_LABEL[item.kategori]}</td>
                <td>{DURUM_LABEL[item.durum]}</td>
                <td>{new Date(item.alisTarihi).toLocaleDateString("tr-TR")}</td>
                <td>
                  {item.alisBedeli.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </td>
                <td>{item.subeAdi}</td>
                <td>
                  <Link to={`/sabit-kiymet/${item.id}`}>Düzenle</Link>
                  <button onClick={() => handleDelete(item.id)}>Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SabitKiymetList;
