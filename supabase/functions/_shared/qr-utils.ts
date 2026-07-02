export function buildDestinationUrl(platform: string, config: Record<string, string>): string {
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
    case 'drive':
      return config.drive_url || config.direct_url || '';
    case 'url':
    default:
      return config.url || 'https://ejemplo.com';
  }
}

export function parseDestinationUrl(platform: string, destinationUrl: string): Record<string, string> {
  const config: Record<string, string> = {};

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
