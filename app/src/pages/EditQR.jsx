import { useParams } from 'react-router-dom';

export default function EditQR() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Editor del QR {id} — próximamente</p>
    </div>
  );
}
