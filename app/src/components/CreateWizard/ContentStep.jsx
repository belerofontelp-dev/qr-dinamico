import { Input } from '../ui';

export default function ContentStep({ type, formData, onFormChange, name, onNameChange }) {
  const renderForm = () => {
    switch (type) {
      case 'website':
        return (
          <div className="space-y-4">
            <Input
              label="Website URL"
              placeholder="https://example.com"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'whatsapp':
        return (
          <div className="space-y-4">
            <Input
              label="Phone Number (with country code)"
              placeholder="+5491100000000"
              value={formData.phone || ''}
              onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Pre-filled Message (optional)"
              placeholder="Hola! Quisiera más información..."
              value={formData.message || ''}
              onChange={(e) => onFormChange({ ...formData, message: e.target.value })}
            />
          </div>
        );
      case 'vcard':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              value={formData.first_name || ''}
              onChange={(e) => onFormChange({ ...formData, first_name: e.target.value })}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.last_name || ''}
              onChange={(e) => onFormChange({ ...formData, last_name: e.target.value })}
            />
            <Input
              label="Phone"
              placeholder="+5491100000000"
              value={formData.phone || ''}
              onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email"
              placeholder="john@example.com"
              value={formData.email || ''}
              onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
            />
            <Input
              label="Company"
              placeholder="Acme Inc."
              value={formData.company || ''}
              onChange={(e) => onFormChange({ ...formData, company: e.target.value })}
            />
            <Input
              label="Position"
              placeholder="CEO"
              value={formData.position || ''}
              onChange={(e) => onFormChange({ ...formData, position: e.target.value })}
            />
            <div className="col-span-2">
              <Input
                label="Website"
                placeholder="https://example.com"
                value={formData.website || ''}
                onChange={(e) => onFormChange({ ...formData, website: e.target.value })}
              />
            </div>
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-4">
            <Input
              label="Network Name (SSID)"
              placeholder="My WiFi Network"
              value={formData.ssid || ''}
              onChange={(e) => onFormChange({ ...formData, ssid: e.target.value })}
            />
            <Input
              label="Password"
              placeholder="Enter network password"
              type="password"
              value={formData.password || ''}
              onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
            />
            <label className="block">
              <span className="text-sm font-semibold text-[#131d29]">Encryption Type</span>
              <div className="flex gap-3 mt-2">
                {['WPA2', 'WPA', 'WEP', 'None'].map((enc) => (
                  <button
                    key={enc}
                    type="button"
                    onClick={() => onFormChange({ ...formData, encryption: enc })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      (formData.encryption || 'WPA2') === enc
                        ? 'border-[#8364ff] bg-[#f3f0ff] text-[#8364ff]'
                        : 'border-[#eeeeee] text-[#6e6e6e] hover:border-[#d5d5d5]'
                    }`}
                  >
                    {enc}
                  </button>
                ))}
              </div>
            </label>
          </div>
        );
      case 'links':
        return (
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="My Links"
              value={formData.title || ''}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            />
            {(formData.links || [{ title: '', url: '' }]).map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  label={idx === 0 ? 'Link Title' : ''}
                  placeholder="Title"
                  value={link.title || ''}
                  onChange={(e) => {
                    const links = [...(formData.links || [{ title: '', url: '' }])];
                    links[idx] = { ...links[idx], title: e.target.value };
                    onFormChange({ ...formData, links });
                  }}
                />
                <Input
                  label={idx === 0 ? 'URL' : ''}
                  placeholder="https://..."
                  value={link.url || ''}
                  onChange={(e) => {
                    const links = [...(formData.links || [{ title: '', url: '' }])];
                    links[idx] = { ...links[idx], url: e.target.value };
                    onFormChange({ ...formData, links });
                  }}
                />
              </div>
            ))}
          </div>
        );
      case 'facebook':
        return (
          <div className="space-y-4">
            <Input
              label="Facebook Page or Profile URL"
              placeholder="https://facebook.com/yourpage"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'instagram':
        return (
          <div className="space-y-4">
            <Input
              label="Instagram Profile URL"
              placeholder="https://instagram.com/yourprofile"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'social':
        return (
          <div className="space-y-4">
            <p className="text-xs text-[#6e6e6e]">Add links to your social media profiles.</p>
            {['whatsapp', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'website'].map((platform) => (
              <Input
                key={platform}
                label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                placeholder={platform === 'website' ? 'https://...' : `https://${platform}.com/...`}
                value={formData[platform] || ''}
                onChange={(e) => onFormChange({ ...formData, [platform]: e.target.value })}
              />
            ))}
          </div>
        );
      case 'apps':
        return (
          <div className="space-y-4">
            <Input
              label="App Store URL (iOS)"
              placeholder="https://apps.apple.com/app/..."
              value={formData.ios_url || ''}
              onChange={(e) => onFormChange({ ...formData, ios_url: e.target.value })}
            />
            <Input
              label="Google Play URL (Android)"
              placeholder="https://play.google.com/store/..."
              value={formData.android_url || ''}
              onChange={(e) => onFormChange({ ...formData, android_url: e.target.value })}
            />
          </div>
        );
      case 'pdf':
        return (
          <div className="space-y-4">
            <Input
              label="PDF URL"
              placeholder="https://example.com/document.pdf"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'images':
        return (
          <div className="space-y-4">
            <Input
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4">
            <Input
              label="Video URL"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'mp3':
        return (
          <div className="space-y-4">
            <Input
              label="Audio File URL"
              placeholder="https://example.com/audio.mp3"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'menu':
        return (
          <div className="space-y-4">
            <Input
              label="Menu URL or Link"
              placeholder="https://example.com/menu"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
      case 'coupon':
        return (
          <div className="space-y-4">
            <Input
              label="Coupon Code"
              placeholder="SAVE20"
              value={formData.code || ''}
              onChange={(e) => onFormChange({ ...formData, code: e.target.value })}
            />
            <Input
              label="Description"
              placeholder="20% off your next purchase"
              value={formData.description || ''}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            />
          </div>
        );
      case 'business':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Business Name"
              placeholder="Acme Inc."
              value={formData.business_name || ''}
              onChange={(e) => onFormChange({ ...formData, business_name: e.target.value })}
            />
            <Input
              label="Phone"
              placeholder="+5491100000000"
              value={formData.phone || ''}
              onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
            />
            <div className="col-span-2">
              <Input
                label="Email"
                placeholder="contact@acme.com"
                value={formData.email || ''}
                onChange={(e) => onFormChange({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Website"
                placeholder="https://acme.com"
                value={formData.website || ''}
                onChange={(e) => onFormChange({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Address"
                placeholder="123 Main St, City"
                value={formData.address || ''}
                onChange={(e) => onFormChange({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <Input
              label="Destination URL"
              placeholder="https://example.com"
              value={formData.url || ''}
              onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Input
        label="QR Code Name"
        placeholder="My QR Code"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <div className="pt-2 border-t border-[#eeeeee]">
        <h3 className="text-sm font-bold text-[#131d29] mb-4">2. Add content to your QR code</h3>
        {renderForm()}
      </div>
    </div>
  );
}
