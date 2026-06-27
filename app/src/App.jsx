import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateQR from './pages/CreateQR';
import EditQR from './pages/EditQR';
import Expired from './pages/Expired';
import Landing from './pages/Landing';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateQR />} />
      <Route path="/edit/:id" element={<EditQR />} />
      <Route path="/expired" element={<Expired />} />
    </Routes>
  );
}
