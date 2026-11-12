import { Routes, Route, Navigate } from 'react-router-dom';
import SabitKiymetList from './features/sabitKiymet/list/SabitKiymetList';
import SabitKiymetCard from './features/sabitKiymet/card/SabitKiymetCardTemp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sabit-kiymet" replace />} />
      <Route path="/sabit-kiymet" element={<SabitKiymetList />} />
      <Route path="/sabit-kiymet/yeni" element={<SabitKiymetCard />} />
      <Route path="/sabit-kiymet/:id" element={<SabitKiymetCard />} />
    </Routes>
  );
}

export default App