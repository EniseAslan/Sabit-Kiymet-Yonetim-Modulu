import type { FormikProps } from 'formik';
import type { SabitKiymetForm } from '../../../types/sabitKiymet.types';

interface SubeBilgileriProps {
  formik: FormikProps<SabitKiymetForm>;
  onSubeSecClick: () => void;
}

function SubeBilgileri({ formik, onSubeSecClick }: SubeBilgileriProps) {
  return (
    <section className="sube-bilgileri">
      <h2>Şube Bilgileri</h2>

      <div className="sube-bilgileri__field">
        <label>Şube</label>
        <div className="sube-bilgileri__branch">
          <span
            className={`sube-bilgileri__branch__value ${
              !formik.values.subeAdi
                ? 'sube-bilgileri__branch__value--empty'
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
        {!formik.values.subeAdi && (
          <p className="sube-bilgileri__hint">
            Kaydetmek için şube seçmeniz önerilir.
          </p>
        )}
      </div>
    </section>
  );
}

export default SubeBilgileri;