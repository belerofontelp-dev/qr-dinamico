export function buildDestinationUrl(platform: string, config: Record<string, any>): string {
  switch (platform) {
    case 'whatsapp': {
      const wa = `https://wa.me/${config.phone}`;
      return config.message ? `${wa}?text=${encodeURIComponent(config.message)}` : wa;
    }
    case 'instagram':
      return config.mode === 'post'
        ? `https://instagram.com/p/${config.post_id}`
        : `https://instagram.com/${config.username}`;
    case 'telegram':
      return config.mode === 'invite'
        ? `https://t.me/+${config.invite_hash}`
        : `https://t.me/${config.username}`;
    case 'twitter':
      return config.mode === 'tweet'
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(config.text || '')}${config.url ? `&url=${encodeURIComponent(config.url)}` : ''}`
        : `https://twitter.com/${config.username}`;
    case 'linkedin':
      return config.mode === 'company'
        ? `https://linkedin.com/company/${config.company}`
        : `https://linkedin.com/in/${config.username}`;
    case 'facebook':
      return config.mode === 'page'
        ? `https://facebook.com/${config.page_id}`
        : `https://facebook.com/${config.username}`;
    case 'wifi':
      return `WIFI:S:${config.ssid};T:${config.encryption};P:${config.password};${config.hidden ? 'H:true;' : ''};`;
    case 'vcard':
      return buildVCard(config);
    case 'linklist':
      return JSON.stringify({ type: 'linklist', links: config.links || [] });
    case 'appstore':
      return JSON.stringify({ type: 'appstore', ios_url: config.ios_url, android_url: config.android_url });
    case 'multisocial':
      return JSON.stringify({ type: 'multisocial', ...config });
    case 'drive':
      return config.drive_url || config.direct_url || '';
    case 'url':
    default:
      return config.url || 'https://ejemplo.com';
  }
}

function buildVCard(config: Record<string, any>): string {
  const n = `${config.last_name || ''};${config.first_name || ''}`;
  const fn = `${config.first_name || ''} ${config.last_name || ''}`.trim();
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
  if (fn) vcard += `FN:${fn}\n`;
  vcard += `N:${n}\n`;
  if (config.phone) vcard += `TEL:${config.phone}\n`;
  if (config.email) vcard += `EMAIL:${config.email}\n`;
  if (config.company) vcard += `ORG:${config.company}\n`;
  if (config.position) vcard += `TITLE:${config.position}\n`;
  if (config.website) vcard += `URL:${config.website}\n`;
  if (config.address) vcard += `ADR:;;${config.address};;;\n`;
  if (config.note) vcard += `NOTE:${config.note}\n`;
  vcard += 'END:VCARD';
  return vcard;
}

export function parseDestinationUrl(platform: string, destinationUrl: string): Record<string, any> {
  const config: Record<string, any> = {};

  switch (platform) {
    case 'whatsapp': {
      const match = destinationUrl.match(/^https:\/\/wa\.me\/(\d+)(\?text=(.*))?$/);
      if (match) {
        config.phone = match[1];
        if (match[3]) config.message = decodeURIComponent(match[3]);
      }
      return config;
    }
    case 'instagram': {
      const profileMatch = destinationUrl.match(/^https:\/\/instagram\.com\/([^/]+)$/);
      const postMatch = destinationUrl.match(/^https:\/\/instagram\.com\/p\/([^/]+)$/);
      if (postMatch) { config.mode = 'post'; config.post_id = postMatch[1]; }
      else if (profileMatch) { config.mode = 'profile'; config.username = profileMatch[1]; }
      return config;
    }
    case 'telegram': {
      const userMatch = destinationUrl.match(/^https:\/\/t\.me\/([^+].+)$/);
      const inviteMatch = destinationUrl.match(/^https:\/\/t\.me\/\+(.+)$/);
      if (inviteMatch) { config.mode = 'invite'; config.invite_hash = inviteMatch[1]; }
      else if (userMatch) { config.mode = 'user'; config.username = userMatch[1]; }
      return config;
    }
    case 'twitter': {
      const profileMatch = destinationUrl.match(/^https:\/\/twitter\.com\/([^/]+)$/);
      const tweetMatch = destinationUrl.match(/^https:\/\/twitter\.com\/intent\/tweet\?text=([^&]*)(?:&url=(.*))?$/);
      if (tweetMatch) { config.mode = 'tweet'; config.text = decodeURIComponent(tweetMatch[1] || ''); if (tweetMatch[2]) config.url = decodeURIComponent(tweetMatch[2]); }
      else if (profileMatch) { config.mode = 'profile'; config.username = profileMatch[1]; }
      return config;
    }
    case 'linkedin': {
      const profileMatch = destinationUrl.match(/^https:\/\/linkedin\.com\/in\/([^/]+)$/);
      const companyMatch = destinationUrl.match(/^https:\/\/linkedin\.com\/company\/([^/]+)$/);
      if (companyMatch) { config.mode = 'company'; config.company = companyMatch[1]; }
      else if (profileMatch) { config.mode = 'profile'; config.username = profileMatch[1]; }
      return config;
    }
    case 'facebook': {
      const profileMatch = destinationUrl.match(/^https:\/\/facebook\.com\/([^/]+)$/);
      if (profileMatch) { config.mode = 'profile'; config.username = profileMatch[1]; }
      return config;
    }
    case 'wifi': {
      const ssidMatch = destinationUrl.match(/S:([^;]*)/);
      const encMatch = destinationUrl.match(/T:([^;]*)/);
      const passMatch = destinationUrl.match(/P:([^;]*)/);
      const hiddenMatch = destinationUrl.match(/H:true/);
      if (ssidMatch) config.ssid = ssidMatch[1];
      if (encMatch) config.encryption = encMatch[1];
      if (passMatch) config.password = passMatch[1];
      if (hiddenMatch) config.hidden = true;
      return config;
    }
    case 'vcard': {
      const fnMatch = destinationUrl.match(/FN:([^\n]*)/);
      const telMatch = destinationUrl.match(/TEL:([^\n]*)/);
      const emailMatch = destinationUrl.match(/EMAIL:([^\n]*)/);
      const orgMatch = destinationUrl.match(/ORG:([^\n]*)/);
      const titleMatch = destinationUrl.match(/TITLE:([^\n]*)/);
      const urlMatch = destinationUrl.match(/\nURL:([^\n]*)/);
      const adrMatch = destinationUrl.match(/ADR:;;([^;]*)/);
      const noteMatch = destinationUrl.match(/NOTE:([^\n]*)/);
      if (fnMatch) { const parts = fnMatch[1].split(' '); config.first_name = parts[0] || ''; config.last_name = parts.slice(1).join(' ') || ''; }
      if (telMatch) config.phone = telMatch[1];
      if (emailMatch) config.email = emailMatch[1];
      if (orgMatch) config.company = orgMatch[1];
      if (titleMatch) config.position = titleMatch[1];
      if (urlMatch) config.website = urlMatch[1];
      if (adrMatch) config.address = adrMatch[1];
      if (noteMatch) config.note = noteMatch[1];
      return config;
    }
    case 'linklist': {
      try { const parsed = JSON.parse(destinationUrl); config.links = parsed.links || []; } catch { config.links = []; }
      return config;
    }
    case 'appstore': {
      try { const parsed = JSON.parse(destinationUrl); config.ios_url = parsed.ios_url || ''; config.android_url = parsed.android_url || ''; } catch {}
      return config;
    }
    case 'multisocial': {
      try { const parsed = JSON.parse(destinationUrl); Object.assign(config, parsed); delete config.type; } catch {}
      return config;
    }
    case 'drive': {
      config.drive_url = destinationUrl;
      return config;
    }
    case 'url':
    default:
      config.url = destinationUrl;
      return config;
  }
}
