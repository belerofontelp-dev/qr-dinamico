export function parseDestinationUrl(platform, destinationUrl) {
  const config = {};

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
      if (tweetMatch) {
        config.mode = 'tweet';
        config.text = decodeURIComponent(tweetMatch[1] || '');
        if (tweetMatch[2]) config.url = decodeURIComponent(tweetMatch[2]);
      } else if (profileMatch) {
        config.mode = 'profile';
        config.username = profileMatch[1];
      }
      return config;
    }
    case 'linkedin': {
      const profileMatch = destinationUrl.match(/^https:\/\/linkedin\.com\/in\/([^/]+)$/);
      const companyMatch = destinationUrl.match(/^https:\/\/linkedin\.com\/company\/([^/]+)$/);
      if (companyMatch) { config.mode = 'company'; config.company = companyMatch[1]; }
      else if (profileMatch) { config.mode = 'profile'; config.username = profileMatch[1]; }
      return config;
    }
    case 'drive':
      config.drive_url = destinationUrl;
      return config;
    case 'url':
    default:
      config.url = destinationUrl;
      return config;
  }
}
