import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateQR from './pages/CreateQR';
import EditQR from './pages/EditQR';
import Expired from './pages/Expired';
import Landing from './pages/Landing';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
          <p className="text-gray-500 mb-4">Ocurrió un error inesperado. Recargá la página para intentar de nuevo.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateQR />} />
        <Route path="/edit/:id" element={<EditQR />} />
        <Route path="/expired" element={<Expired />} />
      </Routes>
    </ErrorBoundary>
  );
}
