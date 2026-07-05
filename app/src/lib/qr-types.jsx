import {
  Globe, FileText, Image, Video, Wifi,
  UtensilsCrossed, Building2, Contact, Music,
  Smartphone, Link2, Ticket, Share2,
} from 'lucide-react';

const SvgIcon = ({ path, viewBox = '0 0 24 24' }) => (
  <svg width="32" height="32" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    {path}
  </svg>
);

const FacebookIcon = () => (
  <SvgIcon
    viewBox="0 0 24 24"
    path={<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />}
  />
);

const InstagramIcon = () => (
  <SvgIcon
    viewBox="0 0 24 24"
    path={<>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
    </>}
  />
);

const WhatsAppIcon = () => (
  <SvgIcon
    viewBox="0 0 24 24"
    path={<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor" />}
  />
);

const MenuIcon = () => (
  <SvgIcon viewBox="0 0 32 32" path={<><rect x="4" y="4" width="24" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="4" y1="11" x2="28" y2="11" stroke="currentColor" strokeWidth="1.5" /><line x1="12" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="1.5" /><line x1="12" y1="25" x2="28" y2="25" stroke="currentColor" strokeWidth="1.5" /></>} />
);

const SocialIcon = () => (
  <SvgIcon viewBox="0 0 32 32" path={<><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="24" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="16" y1="14.5" x2="21" y2="10.5" stroke="currentColor" strokeWidth="1.2" /><line x1="14.5" y1="16" x2="18.5" y2="20" stroke="currentColor" strokeWidth="1.2" /></>} />
);

const BusinessIcon = () => (
  <SvgIcon viewBox="0 0 32 32" path={<><rect x="6" y="10" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" /><rect x="14" y="18" width="4" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" /><line x1="10" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="14" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="18" y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><line x1="22" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 10V8a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5" fill="none" /></>} />
);

export const QR_TYPES = {
  website: {
    id: 'website',
    label: 'Website',
    description: 'Link to any website URL',
    icon: Globe,
    order: 1
  },
  pdf: {
    id: 'pdf',
    label: 'PDF',
    description: 'Show a PDF',
    icon: FileText,
    order: 2
  },
  images: {
    id: 'images',
    label: 'Images',
    description: 'Share multiple images',
    icon: Image,
    order: 3
  },
  video: {
    id: 'video',
    label: 'Video',
    description: 'Show a video',
    icon: Video,
    order: 4
  },
  wifi: {
    id: 'wifi',
    label: 'WiFi',
    description: 'Connect to a Wi-Fi network',
    icon: Wifi,
    order: 5
  },
  menu: {
    id: 'menu',
    label: 'Menu',
    description: 'Create a restaurant menu',
    icon: MenuIcon,
    order: 6
  },
  business: {
    id: 'business',
    label: 'Business',
    description: 'Share information about your business',
    icon: BusinessIcon,
    order: 7
  },
  vcard: {
    id: 'vcard',
    label: 'vCard',
    description: 'Share a digital business card',
    icon: Contact,
    order: 8
  },
  mp3: {
    id: 'mp3',
    label: 'MP3',
    description: 'Share an audio file',
    icon: Music,
    order: 9
  },
  apps: {
    id: 'apps',
    label: 'Apps',
    description: 'Redirect to an app store',
    icon: Smartphone,
    order: 10
  },
  links: {
    id: 'links',
    label: 'List of Links',
    description: 'Share multiple links',
    icon: Link2,
    order: 11
  },
  coupon: {
    id: 'coupon',
    label: 'Coupon',
    description: 'Share a coupon',
    icon: Ticket,
    order: 12
  },
  facebook: {
    id: 'facebook',
    label: 'Facebook',
    description: 'Share your Facebook page',
    icon: FacebookIcon,
    order: 13
  },
  instagram: {
    id: 'instagram',
    label: 'Instagram',
    description: 'Share your Instagram',
    icon: InstagramIcon,
    order: 14
  },
  social: {
    id: 'social',
    label: 'Social Media',
    description: 'Share your social channels',
    icon: SocialIcon,
    order: 15
  },
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Get WhatsApp messages',
    icon: WhatsAppIcon,
    order: 16
  }
};

export const QR_TYPE_LIST = Object.values(QR_TYPES).sort((a, b) => a.order - b.order);
