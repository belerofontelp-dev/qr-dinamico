import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useQR(user) {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQRs = useCallback(async () => {
    if (!user) { setQrCodes([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setQrCodes(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchQRs(); }, [fetchQRs]);

  const createQR = async (payload) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-qr`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      }
    );
    if (!res.ok) throw new Error((await res.json()).error ?? 'Error al crear QR');
    const qr = await res.json();
    setQrCodes(prev => [qr, ...prev]);
    return qr;
  };

  const deleteQR = async (id) => {
    const { error } = await supabase.from('qr_codes').delete().eq('id', id);
    if (error) throw error;
    setQrCodes(prev => prev.filter(q => q.id !== id));
  };

  return { qrCodes, loading, createQR, deleteQR, refetch: fetchQRs };
}
