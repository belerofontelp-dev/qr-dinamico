export { QR_TYPES, QR_TYPE_LIST } from './qr-types';
import {
  WhatsAppIcon, InstagramIcon, TelegramIcon,
  TwitterIcon, LinkedInIcon, UrlIcon, DriveIcon,
  WiFiIcon, VCardIcon, FacebookIcon,
  LinkListIcon, AppStoreIcon, MultiSocialIcon
} from './platform-icons.jsx';

export const PLATFORMS = {
  whatsapp: { label: 'WhatsApp', Icon: WhatsAppIcon, qrType: 'whatsapp' },
  instagram: { label: 'Instagram', Icon: InstagramIcon, qrType: 'instagram' },
  telegram: { label: 'Telegram', Icon: TelegramIcon, qrType: 'url' },
  twitter: { label: 'X / Twitter', Icon: TwitterIcon, qrType: 'url' },
  linkedin: { label: 'LinkedIn', Icon: LinkedInIcon, qrType: 'url' },
  facebook: { label: 'Facebook', Icon: FacebookIcon, qrType: 'facebook' },
  url: { label: 'URL genérica', Icon: UrlIcon, qrType: 'website' },
  drive: { label: 'Google Drive', Icon: DriveIcon, qrType: 'url' },
  wifi: { label: 'WiFi', Icon: WiFiIcon, qrType: 'wifi' },
  vcard: { label: 'vCard / Contacto', Icon: VCardIcon, qrType: 'vcard' },
  linklist: { label: 'Lista de Links', Icon: LinkListIcon, qrType: 'links' },
  appstore: { label: 'App Store', Icon: AppStoreIcon, qrType: 'apps' },
  multisocial: { label: 'Multi Social Media', Icon: MultiSocialIcon, qrType: 'social' }
};

export const PLATFORM_OPTIONS = Object.entries(PLATFORMS).map(([value, { label }]) => ({ value, label }));
