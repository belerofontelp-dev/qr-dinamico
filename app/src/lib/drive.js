const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';

export async function getOrCreateFolder(accessToken) {
  const query = encodeURIComponent("name='QRApp' and mimeType='application/vnd.google-apps.folder' and trashed=false");
  const folderRes = await fetch(
    `${DRIVE_API}?q=${query}&fields=files(id)&pageSize=1`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const { files } = await folderRes.json();

  if (files?.[0]?.id) return files[0].id;

  const createRes = await fetch(DRIVE_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'QRApp', mimeType: 'application/vnd.google-apps.folder' })
  });
  const created = await createRes.json();
  return created.id;
}

export async function uploadFile({ file, accessToken, folderId }) {
  const metadata = JSON.stringify({ name: file.name, parents: [folderId] });
  const form = new FormData();
  form.append('metadata', new Blob([metadata], { type: 'application/json' }));
  form.append('file', file);

  const uploadRes = await fetch(
    `${DRIVE_API}?uploadType=multipart&fields=id,webViewLink,webContentLink`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form
    }
  );
  const driveFile = await uploadRes.json();

  await fetch(`${DRIVE_API}/${driveFile.id}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  });

  return {
    file_id: driveFile.id,
    view_url: driveFile.webViewLink,
    direct_url: `https://drive.google.com/uc?id=${driveFile.id}&export=download`
  };
}

export async function deleteFile(fileId, accessToken) {
  await fetch(`${DRIVE_API}/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
}
