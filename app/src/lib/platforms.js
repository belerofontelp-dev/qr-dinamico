import {
  WhatsAppIcon,
  InstagramIcon,
  TelegramIcon,
  TwitterIcon,
  LinkedInIcon,
  UrlIcon,
  DriveIcon
} from './platform-icons.jsx';

export const PLATFORMS = {
  whatsapp: { label: 'WhatsApp', Icon: WhatsAppIcon },
  instagram: { label: 'Instagram', Icon: InstagramIcon },
  telegram: { label: 'Telegram', Icon: TelegramIcon },
  twitter: { label: 'X / Twitter', Icon: TwitterIcon },
  linkedin: { label: 'LinkedIn', Icon: LinkedInIcon },
  url: { label: 'URL genérica', Icon: UrlIcon },
  drive: { label: 'Google Drive', Icon: DriveIcon }
};

export const PLATFORM_OPTIONS = Object.entries(PLATFORMS).map(([value, { label }]) => ({ value, label }));
