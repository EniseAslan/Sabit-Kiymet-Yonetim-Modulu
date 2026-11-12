import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  createSabitKiymet,
  getSabitKiymet,
  updateSabitKiymet,
} from '../../../api/sabitKiymet.api';
import {
  Durum,
  Kategori,
  type SabitKiymetForm,
} from '../../../types/sabitKiymet.types';
import type { Sube } from '../../../types/sube.types';
import { hesaplaYillikAmortisman } from '../../../utils/_project/sabitKiymet';
import Notification from '../../../components/Notification';
import GenelBilgiler from './GenelBilgiler';
import SubeModal from '../modal/SubeModal';
import './SabitKiymetCard.scss';

const validationSchema = Yup.object({
  ad: Yup.string().trim().required('Ad zorunludur'),
  alisBedeli: Yup.number()
    .typeError('Alış bedeli bir sayı olmalıdır')
    .moreThan(0, "Alış bedeli 0'dan büyük olmalıdır")
    .required('Alış bedeli zorunludur'),
});

const EMPTY_FORM: SabitKiymetForm = {
  ad: '',
  kategori: Kategori.Bina,
  alisTarihi: new Date().toISOString().slice(0, 10),
  alisBedeli: 0,
  amortismanOrani: 0,
  durum: Durum.Aktif,
  subeId: 0,
  subeAdi: '',
};

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

function SabitKiymetCard() {
  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [subeModalOpen, setSubeModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>(null);

  const formik = useFormik<SabitKiymetForm>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await createSabitKiymet(values);
          navigate('/sabit-kiymet', {
            state: { message: 'Kayıt eklendi', type: 'success' },
          });
        } else {
          await updateSabitKiymet(Number(id), values);
          navigate('/sabit-kiymet', {
            state: { message: 'Kayıt güncellendi', type: 'success' },
          });
        }
      } catch {
        setNotification({
          message: 'Kayıt başarısız oldu. Lütfen tekrar deneyin.',
          type: 'error',
        });
      }
    },
  });

  const { setValues } = formik;

  useEffect(() => {
    if (isNew) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await getSabitKiymet(Number(id));
        setValues(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew, setValues]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(t);
  }, [notification]);

  const yillikAmortisman = useMemo(
    () =>
      hesaplaYillikAmortisman(
        formik.values.alisBedeli,
        formik.values.amortismanOrani,
      ),
    [formik.values.alisBedeli, formik.values.amortismanOrani],
  );

  const handleSubeSelect = (sube: Sube) => {
    formik.setValues({
      ...formik.values,
      subeId: sube.id,
      subeAdi: sube.adi,
    });
  };

  if (loading) return <p>Yükleniyor…</p>;

  if (notFound) {
    return (
      <div className="sabit-kiymet-card">
        <div className="sabit-kiymet-card__header">
          <h1>Kayıt Bulunamadı</h1>
          <Link to="/sabit-kiymet" className="btn btn--secondary btn--sm">
            ← Listeye dön
          </Link>
        </div>
        <p>Bu ID ile bir sabit kıymet kaydı bulunamadı.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sabit-kiymet-card">
        <div className="sabit-kiymet-card__header">
          <h1>Hata</h1>
          <Link to="/sabit-kiymet" className="btn btn--secondary btn--sm">
            ← Listeye dön
          </Link>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="sabit-kiymet-card">
      <div className="sabit-kiymet-card__header">
        <h1>{isNew ? 'Yeni Sabit Kıymet' : `Sabit Kıymet #${id}`}</h1>
        <Link to="/sabit-kiymet" className="btn btn--secondary btn--sm">
          ← Listeye dön
        </Link>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={formik.handleSubmit} className="sabit-kiymet-card__form">
        <GenelBilgiler
          formik={formik}
          yillikAmortisman={yillikAmortisman}
          onSubeSecClick={() => setSubeModalOpen(true)}
        />

        <div className="sabit-kiymet-card__actions">
          <Link to="/sabit-kiymet" className="btn btn--secondary">
            İptal
          </Link>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </form>

      <SubeModal
        open={subeModalOpen}
        onClose={() => setSubeModalOpen(false)}
        onSelect={handleSubeSelect}
      />
    </div>
  );
}

export default SabitKiymetCard;