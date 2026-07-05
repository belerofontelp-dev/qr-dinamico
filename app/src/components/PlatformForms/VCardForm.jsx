import { useState, useEffect } from 'react';

export default function VCardForm({ onChange, initial }) {
  const [firstName, setFirstName] = useState(initial?.first_name || '');
  const [lastName, setLastName] = useState(initial?.last_name || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [company, setCompany] = useState(initial?.company || '');
  const [position, setPosition] = useState(initial?.position || '');
  const [website, setWebsite] = useState(initial?.website || '');
  const [address, setAddress] = useState(initial?.address || '');
  const [note, setNote] = useState(initial?.note || '');

  useEffect(() => {
    if (onChange) {
      onChange({ first_name: firstName, last_name: lastName, phone, email, company, position, website, address, note });
    }
  }, [firstName, lastName, phone, email, company, position, website, address, note, onChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Juan"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Apellido</span>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Pérez"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Teléfono</span>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+54 11 1234-5678"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="juan@ejemplo.com"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium">Empresa</span>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="Mi Empresa S.A."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Cargo</span>
          <input
            type="text"
            value={position}
            onChange={e => setPosition(e.target.value)}
            placeholder="CEO"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Sitio web</span>
        <input
          type="url"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          placeholder="https://miejemplo.com"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Dirección</span>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Av. Corrientes 1234, CABA"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Nota (opcional)</span>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Información adicional..."
          rows={2}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </label>
    </div>
  );
}
