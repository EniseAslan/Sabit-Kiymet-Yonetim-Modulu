import type { FormikProps } from 'formik';
import {
  DURUM_OPTIONS,
  KATEGORI_OPTIONS,
  type SabitKiymetForm,
} from '../../../types/sabitKiymet.types';
import { formatPara } from '../../../utils/_project/sabitKiymet';

interface GenelBilgilerProps {
  formik: FormikProps<SabitKiymetForm>;
  yillikAmortisman: number;
  onSubeSecClick: () => void;
}

function GenelBilgiler({
  formik,
  yillikAmortisman,
  onSubeSecClick,
}: GenelBilgilerProps) {
  const adError = formik.touched.ad && formik.errors.ad;
  const bedelError = formik.touched.alisBedeli && formik.errors.alisBedeli;

  return (
    <section className="genel-bilgiler">
      <h2>Genel Bilgiler</h2>

      <div className="genel-bilgiler__field">
        <label htmlFor="ad">Ad</label>
        <input
          id="ad"
          name="ad"
          type="text"
          value={formik.values.ad}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={adError ? 'input--error' : ''}
          aria-invalid={!!adError}
        />
        {adError && (
          <p className="genel-bilgiler__field__error">{formik.errors.ad}</p>
        )}
      </div>

      <div className="genel-bilgiler__field">
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

      <div className="genel-bilgiler__field">
        <label htmlFor="alisTarihi">Alış Tarihi</label>
        <input
          id="alisTarihi"
          name="alisTarihi"
          type="date"
          value={formik.values.alisTarihi}
          onChange={formik.handleChange}
        />
      </div>

      <div className="genel-bilgiler__field">
        <label htmlFor="alisBedeli">Alış Bedeli (₺)</label>
        <input
          id="alisBedeli"
          name="alisBedeli"
          type="number"
          step="any"
          value={formik.values.alisBedeli}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={bedelError ? 'input--error' : ''}
          aria-invalid={!!bedelError}
        />
        {bedelError && (
          <p className="genel-bilgiler__field__error">
            {formik.errors.alisBedeli}
          </p>
        )}
      </div>

      <div className="genel-bilgiler__field">
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

      <div className="genel-bilgiler__field">
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

      <div className="genel-bilgiler__field">
        <label>Şube</label>
        <div className="genel-bilgiler__branch">
          <span
            className={`genel-bilgiler__branch__value ${
              !formik.values.subeAdi
                ? 'genel-bilgiler__branch__value--empty'
                : ''
            }`}
          >
            {formik.values.subeAdi || 'Şube seçilmedi'}
          </span>
          <button
            type="button"
            onClick={onSubeSecClick}
            className="btn btn--secondary"
          >
            Şube Seç
          </button>
        </div>
      </div>

      <div className="genel-bilgiler__amortisman">
        <span>Yıllık Amortisman</span>
        <strong>{formatPara(yillikAmortisman)}</strong>
      </div>
    </section>
  );
}

export default GenelBilgiler;