import { Link, useParams } from 'react-router-dom';

function SabitKiymetCard() {
  const { id } = useParams();
  const isNew = id === undefined;

  return (
    <div>
      <Link to="/sabit-kiymet">← Listeye dön</Link>
      <h1>{isNew ? 'Yeni Sabit Kıymet' : `Sabit Kıymet #${id}`}</h1>
    </div>
  );
}

export default SabitKiymetCard;