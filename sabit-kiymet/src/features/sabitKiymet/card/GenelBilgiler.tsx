import type { FormikProps } from 'formik';
import {
  DURUM_OPTIONS,
  KATEGORI_OPTIONS,
  type SabitKiymetForm,
} from '../../../types/sabitKiymet.types';

interface GenelBilgilerProps {
  formik: FormikProps<SabitKiymetForm>;
  yillikAmortisman: number;
}

function GenelBilgiler({ formik, yillikAmortisman }: GenelBilgilerProps) {


  return (
    <section>
      <h2>Genel Bilgiler</h2>

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

      <p>
        Yıllık Amortisman:{' '}
        <strong>
          {yillikAmortisman.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
          })}
        </strong>
      </p>


    </section>
  );
}

export default GenelBilgiler;