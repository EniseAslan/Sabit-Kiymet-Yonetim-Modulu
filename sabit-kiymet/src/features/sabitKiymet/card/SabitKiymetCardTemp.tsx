import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createSabitKiymet,
  getSabitKiymet,
  updateSabitKiymet,
} from "../../../api/sabitKiymet.api";
import {
  Durum,
  Kategori,
  type SabitKiymetForm,
} from "../../../types/sabitKiymet.types";
import type { Sube } from "../../../types/sube.types";
import { hesaplaYillikAmortisman } from "../../../utils/_project/sabitKiymet";
import Notification from "../../../components/Notification";
import GenelBilgiler from "./GenelBilgiler";
import SubeBilgileri from "./SubeBilgileri";
import KartTabs, { type KartTab } from "./KartTabs";
import SubeModal from "../modal/SubeModal";
import "./SabitKiymetCard.scss";

const validationSchema = Yup.object({
  ad: Yup.string().trim().required("Ad zorunludur"),
  alisBedeli: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Alış bedeli bir sayı olmalıdır")
    .moreThan(0, "Alış bedeli 0'dan büyük olmalıdır")
    .required("Alış bedeli zorunludur"),
});

const EMPTY_FORM: SabitKiymetForm = {
  ad: "",
  kategori: Kategori.Bina,
  alisTarihi: new Date().toISOString().slice(0, 10),
  alisBedeli: "",
  amortismanOrani: "",
  durum: Durum.Aktif,
  subeId: 0,
  subeAdi: "",
};

type NotificationState = {
  message: string;
  type: "success" | "error";
} | null;

interface SabitKiymetCardProps {
  isInModal?: boolean;
  onSaved?: () => void;
  onCancel?: () => void;
}

function SabitKiymetCard({
  isInModal = false,
  onSaved,
  onCancel,
}: SabitKiymetCardProps) {
  const { id } = useParams();
  const isNew = id === undefined;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [subeModalOpen, setSubeModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState>(null);
  const [activeTab, setActiveTab] = useState<KartTab>("genel");

  const formik = useFormik<SabitKiymetForm>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: async (values, { validateForm }) => {
      const errors = await validateForm();
      if (errors.ad || errors.alisBedeli) {
        setActiveTab("genel");
        return;
      }

      if (!values.subeAdi) {
        const shouldContinue = window.confirm(
          "Şube seçmediniz. Şube seçmeden kaydetmek istediğinize emin misiniz?",
        );

        if (!shouldContinue) {
          setActiveTab("sube");
          return;
        }
      }

      try {
        const payload: SabitKiymetForm = {
          ...values,
          alisBedeli: Number(values.alisBedeli) || 0,
          amortismanOrani: Number(values.amortismanOrani) || 0,
        };

        if (isNew) {
          await createSabitKiymet(payload);
        } else {
          await updateSabitKiymet(Number(id), payload);
        }

        if (isInModal) {
          onSaved?.();
        } else {
          navigate("/sabit-kiymet", {
            state: {
              message: isNew ? "Kayıt eklendi" : "Kayıt güncellendi",
              type: "success",
            },
          });
        }
      } catch {
        setNotification({
          message: "Kayıt başarısız oldu. Lütfen tekrar deneyin.",
          type: "error",
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
        if (err instanceof Error && err.message.includes("404")) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : "Bilinmeyen hata");
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
        Number(formik.values.alisBedeli) || 0,
        Number(formik.values.amortismanOrani) || 0,
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
          {!isInModal && (
            <Link to="/sabit-kiymet" className="btn btn--secondary btn--sm">
              ← Listeye dön
            </Link>
          )}
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
          {!isInModal && (
            <Link to="/sabit-kiymet" className="btn btn--secondary btn--sm">
              ← Listeye dön
            </Link>
          )}
        </div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="sabit-kiymet-card">
      <div className="sabit-kiymet-card__header">
        <h1>{isNew ? "Yeni Sabit Kıymet" : `Sabit Kıymet #${id}`}</h1>
        {!isInModal && (
          <Link to="/sabit-kiymet" className="btn btn--secondary btn--sm">
            ← Listeye dön
          </Link>
        )}
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={formik.handleSubmit} className="sabit-kiymet-card__form">
        <KartTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "genel" && (
          <GenelBilgiler formik={formik} yillikAmortisman={yillikAmortisman} />
        )}

        {activeTab === "sube" && (
          <SubeBilgileri
            formik={formik}
            onSubeSecClick={() => setSubeModalOpen(true)}
          />
        )}

        <div className="sabit-kiymet-card__actions">
          {isInModal ? (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onCancel}
            >
              İptal
            </button>
          ) : (
            <Link to="/sabit-kiymet" className="btn btn--secondary">
              İptal
            </Link>
          )}
          <button
            type="submit"
            className="btn btn--primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Kaydediliyor…" : "Kaydet"}
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
