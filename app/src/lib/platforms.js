import {
  WhatsAppIcon,
  InstagramIcon,
  TelegramIcon,
  TwitterIcon,
  LinkedInIcon,
  UrlIcon,
  DriveIcon,
  WiFiIcon,
  VCardIcon,
  FacebookIcon,
  LinkListIcon,
  AppStoreIcon,
  MultiSocialIcon
} from './platform-icons.jsx';

export const PLATFORMS = {
  whatsapp: { label: 'WhatsApp', Icon: WhatsAppIcon },
  instagram: { label: 'Instagram', Icon: InstagramIcon },
  telegram: { label: 'Telegram', Icon: TelegramIcon },
  twitter: { label: 'X / Twitter', Icon: TwitterIcon },
  linkedin: { label: 'LinkedIn', Icon: LinkedInIcon },
  facebook: { label: 'Facebook', Icon: FacebookIcon },
  url: { label: 'URL genérica', Icon: UrlIcon },
  drive: { label: 'Google Drive', Icon: DriveIcon },
  wifi: { label: 'WiFi', Icon: WiFiIcon },
  vcard: { label: 'vCard / Contacto', Icon: VCardIcon },
  linklist: { label: 'Lista de Links', Icon: LinkListIcon },
  appstore: { label: 'App Store', Icon: AppStoreIcon },
  multisocial: { label: 'Multi Social Media', Icon: MultiSocialIcon }
};

export const PLATFORM_OPTIONS = Object.entries(PLATFORMS).map(([value, { label }]) => ({ value, label }));
