// Edge Function: upload-to-drive
// POST — recibe un archivo en base64 y lo sube al Google Drive del usuario.

import { serve } from 'https://deno.land/std/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const { file_base64, file_name, mime_type, access_token } = await req.json();

  if (!file_base64 || !file_name || !access_token) {
    return jsonResponse(JSON.stringify({ error: 'file_base64, file_name y access_token son requeridos' }), 400);
  }

  // Encontrar o crear carpeta QRApp
  const folderRes = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=name%3D'QRApp'+and+mimeType%3D'application%2Fvnd.google-apps.folder'+and+trashed%3Dfalse&fields=files(id)&pageSize=1",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const { files } = await folderRes.json();

  let folderId = files?.[0]?.id;
  if (!folderId) {
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'QRApp',
        mimeType: 'application/vnd.google-apps.folder'
      })
    });
    const created = await createRes.json();
    folderId = created.id;
  }

  // Subir archivo con multipart
  const boundary = '----qrboundary';
  const metadata = JSON.stringify({ name: file_name, parents: [folderId] });
  const bodyParts = [
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
    `--${boundary}\r\nContent-Type: ${mime_type || 'application/octet-stream'}\r\nContent-Transfer-Encoding: base64\r\n\r\n${file_base64}\r\n`,
    `--${boundary}--`
  ].join('');

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: bodyParts
    }
  );
  const driveFile = await uploadRes.json();

  if (!driveFile.id) {
    return jsonResponse(JSON.stringify({ error: 'Error al subir el archivo', detail: driveFile }), 500);
  }

  // Hacer público (cualquiera con el link puede ver)
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${driveFile.id}/permissions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    }
  );

  return jsonResponse(JSON.stringify({
    file_id: driveFile.id,
    view_url: driveFile.webViewLink,
    direct_url: `https://drive.google.com/uc?id=${driveFile.id}&export=download`
  }));
});
