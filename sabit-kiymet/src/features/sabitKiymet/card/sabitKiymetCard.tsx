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
import GenelBilgiler from './GenelBilgiler';

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
    () => (formik.values.alisBedeli * formik.values.amortismanOrani) / 100,
    [formik.values.alisBedeli, formik.values.amortismanOrani],
  );

  if (loading) return <p>Yükleniyor…</p>;
  if (error) {
    return (
      <div>
        <p>Hata: {error}</p>
        <Link to="/sabit-kiymet">← Listeye dön</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/sabit-kiymet">← Listeye dön</Link>
      <h1>{isNew ? 'Yeni Sabit Kıymet' : `Sabit Kıymet #${id}`}</h1>

      <form onSubmit={formik.handleSubmit}>
        <GenelBilgiler formik={formik} yillikAmortisman={yillikAmortisman} />

        <button type="submit" disabled={formik.isSubmitting}>
          Kaydet
        </button>
        <Link to="/sabit-kiymet">İptal</Link>
      </form>
    </div>
  );
}

export default SabitKiymetCard;