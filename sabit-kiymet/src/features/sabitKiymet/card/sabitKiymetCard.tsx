import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSabitKiymet } from '../../../api/sabitKiymet.api';
import {
  DURUM_OPTIONS,
  Durum,
  KATEGORI_OPTIONS,
  Kategori,
  type SabitKiymetForm,
} from '../../../types/sabitKiymet.types';

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

  const formik = useFormik<SabitKiymetForm>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createSabitKiymet(values);
        navigate('/sabit-kiymet');
      } catch {
        window.alert('Kayıt başarısız oldu.');
      }
    },
  });

  return (
    <div>
      <Link to="/sabit-kiymet">← Listeye dön</Link>
      <h1>{isNew ? 'Yeni Sabit Kıymet' : `Sabit Kıymet #${id}`}</h1>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="ad">Ad</label>
          <input
            id="ad"
            name="ad"
            type="text"
            value={formik.values.ad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.ad && formik.errors.ad && <p>{formik.errors.ad}</p>}
        </div>
        <div>
          <label htmlFor="kategori">Kategori</label>
          <select
            id="kategori"
            name="kategori"
            value={formik.values.kategori}
            onChange={formik.handleChange}
          >
            {KATEGORI_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="alisTarihi">Alış Tarihi</label>
          <input
            id="alisTarihi"
            name="alisTarihi"
            type="date"
            value={formik.values.alisTarihi}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <label htmlFor="alisBedeli">Alış Bedeli (₺)</label>
          <input
            id="alisBedeli"
            name="alisBedeli"
            type="number"
            step="any"
            value={formik.values.alisBedeli}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.alisBedeli && formik.errors.alisBedeli && (
            <p>{formik.errors.alisBedeli}</p>
          )}
        </div>

        <div>
          <label htmlFor="amortismanOrani">Amortisman Oranı (%)</label>
          <input
            id="amortismanOrani"
            name="amortismanOrani"
            type="number"
            step="any"
            value={formik.values.amortismanOrani}
            onChange={formik.handleChange}
          />
        </div>

        <div>
          <label htmlFor="durum">Durum</label>
          <select
            id="durum"
            name="durum"
            value={formik.values.durum}
            onChange={formik.handleChange}
          >
            {DURUM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={!isNew || formik.isSubmitting}>
          Kaydet
        </button>
        <Link to="/sabit-kiymet">İptal</Link>
      </form>
    </div>
  );
}

export default SabitKiymetCard;