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

function SabitKiymetCard() {
  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [subeModalOpen, setSubeModalOpen] = useState<boolean>(false);

  const formik = useFormik<SabitKiymetForm>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await createSabitKiymet(values);
        } else {
          await updateSabitKiymet(Number(id), values);
        }
        navigate('/sabit-kiymet');
      } catch {
        window.alert('Kayıt başarısız oldu.');
      }
    },
  });

  const { setValues } = formik;

  useEffect(() => {
    if (isNew) return;

    const load = async () => {
      try {
        const data = await getSabitKiymet(Number(id));
        setValues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew, setValues]);

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
            Kaydet
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