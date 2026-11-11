import { useEffect, useState } from 'react';
import { getSubeler } from '../../../api/sube.api';
import type { Sube } from '../../../types/sube.types';

interface SubeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (sube: Sube) => void;
}

function SubeModal({ open, onClose, onSelect }: SubeModalProps) {
  const [subeler, setSubeler] = useState<Sube[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubeler();
        setSubeler(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Şube Seç</h2>
          <button onClick={onClose}>×</button>
        </div>

        {loading && <p>Yükleniyor…</p>}
        {error && <p>Hata: {error}</p>}

        {!loading && !error && (
          <ul className="sube-listesi">
            {subeler.length === 0 ? (
              <li>Şube bulunamadı</li>
            ) : (
              subeler.map((sube) => (
                <li key={sube.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(sube);
                      onClose();
                    }}
                  >
                    {sube.adi}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SubeModal;