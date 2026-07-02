import { useState, useRef, useEffect } from 'react';
import { uploadFile, getOrCreateFolder } from '../../lib/drive';
import { getGoogleAccessToken } from '../../lib/supabase';

export default function DriveForm({ onChange, initial }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(initial?.drive_url ? { file_id: initial.drive_file_id, direct_url: initial.drive_url } : null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (onChange && uploaded) {
      onChange({ drive_file_id: uploaded.file_id, drive_url: uploaded.direct_url });
    }
  }, [uploaded, onChange]);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setUploaded(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const accessToken = await getGoogleAccessToken();
      if (!accessToken) throw new Error('No se pudo obtener el token de Google. Iniciá sesión de nuevo.');

      const folderId = await getOrCreateFolder(accessToken);
      const result = await uploadFile({ file, accessToken, folderId });
      setUploaded(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium">Archivo (Google Drive)</span>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <input
          ref={fileRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        {file ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
            {!uploaded && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
              >
                {uploading ? 'Subiendo...' : 'Subir a Drive'}
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm text-gray-500 hover:text-gray-700 py-4"
          >
            Click para seleccionar un archivo
          </button>
        )}
      </div>

      {uploaded && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          Archivo subido. Los escaneos del QR redirigirán al archivo.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
