import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#6B7280'];

export default function AnalyticsDashboard({ qrId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!qrId) return;
    setLoading(true);

    async function fetchStats() {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qr-stats?qr_id=${qrId}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      if (res.ok) {
        setStats(await res.json());
      }
      setLoading(false);
    }

    fetchStats();
  }, [qrId]);

  const exportCSV = () => {
    if (!stats) return;
    let csv = 'Fecha,País,Dispositivo\n';
    if (stats.timeline) {
      stats.timeline.forEach(row => {
        csv += `${row.date},,\n`;
      });
    }
    if (stats.by_country) {
      csv = 'País,Escaneos\n';
      stats.by_country.forEach(row => {
        csv += `${row.country},${row.count}\n`;
      });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-stats-${qrId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  if (!stats) return <p className="text-center py-12 text-gray-500">No hay datos disponibles.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Estadísticas del QR</h2>
        <button
          onClick={exportCSV}
          className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Total" value={stats.total_scans} />
        <KpiCard label="Hoy" value={stats.today} />
        <KpiCard label="Esta semana" value={stats.this_week} />
      </div>

      {stats.timeline?.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium mb-3">Escaneos por día</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="scans" stroke="#000000" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.by_country?.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium mb-3">Por país</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.by_country}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="country" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.by_device?.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium mb-3">Por dispositivo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.by_device} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={80} label>
                {stats.by_device.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold">{value ?? 0}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
