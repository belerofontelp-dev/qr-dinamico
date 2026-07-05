import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';
import { QR_TYPE_LIST } from '../lib/qr-types';
import { generateQRCode } from '../lib/qr-generator';
import { Stepper } from '../components/ui';
import Button from '../components/ui/Button';
import TypeSelector from '../components/CreateWizard/TypeSelector';
import ContentStep from '../components/CreateWizard/ContentStep';
import DesignStep from '../components/CreateWizard/DesignStep';
import DownloadStep from '../components/CreateWizard/DownloadStep';
import BottomBar from '../components/CreateWizard/BottomBar';
import MobilePreview from '../components/MobilePreview/MobilePreview';
import QRRenderer from '../components/QREditor/QRRenderer';
import { HelpCircle, X } from 'lucide-react';

const STEPS = [
  { label: 'Select QR type' },
  { label: 'Add content' },
  { label: 'Design QR code' },
  { label: 'Download QR code' }
];

const TUTORIAL_STEPS = [
  {
    img: 'https://qr-generator.ai/themes/altum/assets/static/s1.webp',
    title: 'Select a QR code type',
    desc: 'Select the type of QR code you need by clicking on the respective icon. You have up to 16 different options.'
  },
  {
    img: 'https://qr-generator.ai/themes/altum/assets/static/s2.webp',
    title: 'Add content to your QR code',
    desc: 'As you add content to your QR code, look at the phone on the right to visualize what people will see after scanning your QR code.'
  },
  {
    img: 'https://qr-generator.ai/themes/altum/assets/static/s3.webp',
    title: 'Design your QR code',
    desc: 'It is time to personalize your QR code. Change its design by adding a frame, selecting your preferred pattern style, adding your own logo and more.'
  }
];

export default function CreateQR() {
  const { user } = useAuth();
  const { createQR } = useQR(user);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState('');
  const [name, setName] = useState('');
  const [formData, setFormData] = useState({});
  const [styleData, setStyleData] = useState({
    qr_color: '#000000',
    qr_bg_color: '#FFFFFF',
    qr_style: 'square',
    qr_corners_style: 'square',
    qr_corners_dot_style: 'square',
    qr_frame_style: 'none',
    qr_frame_text: 'Scan me',
    qr_frame_text_color: '#000000',
    qr_image_size: 0.4,
    qr_image_margin: 0,
    qr_error_correction: 'H',
    qr_logo_path: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const [qrInstance, setQrInstance] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const qrContainerRef = useRef(null);

  const previewUrl = `${import.meta.env.VITE_WORKER_URL}/q/preview`;
  const currentTypeLabel = QR_TYPE_LIST.find((t) => t.id === qrType)?.label || '';

  useEffect(() => {
    if (!qrContainerRef.current) return;
    const qr = generateQRCode(previewUrl, {
      qrColor: styleData.qr_color ?? '#000000',
      qrBgColor: styleData.qr_bg_color ?? '#FFFFFF',
      qrStyle: styleData.qr_style ?? 'square',
      qrCornersStyle: styleData.qr_corners_style ?? 'square',
      qrCornersDotStyle: styleData.qr_corners_dot_style ?? 'square',
      qrLogoUrl: styleData.qr_logo_path,
      qrImageSize: styleData.qr_image_size ?? 0.4,
      qrImageMargin: styleData.qr_image_margin ?? 0,
      qrErrorCorrection: styleData.qr_error_correction ?? 'H',
      width: 180,
      height: 180
    });
    setQrInstance(qr);
    const el = qrContainerRef.current;
    el.innerHTML = '';
    qr.append(el);
    return () => {
      qrContainerRef.current && (qrContainerRef.current.innerHTML = '');
    };
  }, [styleData, previewUrl]);

  const handleTypeSelect = (type) => {
    setQrType(type);
    setStep(2);
  };

  const validateStep = () => {
    if (step === 1 && !qrType) return 'Please select a QR type';
    if (step === 2 && !name.trim()) return 'QR name is required';
    return '';
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('QR name is required'); return; }
    setLoading(true);
    setError('');

    try {
      const platformData = { platform: qrType, name, ...formData, ...styleData };
      const qr = await createQR(platformData);
      setCreated(qr);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setStep(1);
    setQrType('');
    setName('');
    setFormData({});
    setStyleData({
      qr_color: '#000000',
      qr_bg_color: '#FFFFFF',
      qr_style: 'square',
      qr_corners_style: 'square',
      qr_corners_dot_style: 'square',
      qr_frame_style: 'none',
      qr_frame_text: 'Scan me',
      qr_frame_text_color: '#000000',
      qr_image_size: 0.4,
      qr_image_margin: 0,
      qr_error_correction: 'H',
      qr_logo_path: null
    });
    setCreated(null);
    setError('');
  };

  const renderQrPreview = () => (
    <div className="flex flex-col items-center gap-3">
      <div ref={qrContainerRef} className="bg-white rounded-xl p-2 border border-[#eeeeee]" />
      <p className="text-[10px] text-[#6e6e6e] font-medium">Scan with your phone</p>
    </div>
  );

  const renderPreviewContent = () => {
    if (step === 1) return null;
    if (!qrType) return null;

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-3">
        <div className="w-12 h-12 rounded-xl bg-[#f3f0ff] flex items-center justify-center mb-3">
          {(() => {
            const typeInfo = QR_TYPE_LIST.find(t => t.id === qrType);
            if (!typeInfo) return null;
            const Icon = typeInfo.icon;
            return <Icon />;
          })()}
        </div>
        <p className="text-xs font-bold text-[#131d29] mb-1">{currentTypeLabel}</p>
        <p className="text-[10px] text-[#a0a0a0] leading-relaxed">
          {name ? `"${name}" will be shown here` : 'Fill in the form to preview your landing page'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#eeeeee]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#8364ff" />
              <rect x="7" y="7" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
              <rect x="10" y="10" width="12" height="12" rx="1" stroke="white" strokeWidth="1.5" fill="none" />
              <rect x="13" y="13" width="6" height="6" rx="0.5" fill="white" />
            </svg>
            <span className="text-sm font-bold text-[#131d29] hidden md:inline">QR Generator</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <Stepper steps={STEPS} current={step} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors"
              title="Help"
            >
              <HelpCircle className="w-4 h-4 text-[#6e6e6e]" />
            </button>
            <Link
              to="/dashboard"
              className="h-8 px-3 flex items-center text-xs font-semibold text-[#6e6e6e] hover:text-[#131d29] rounded-lg border border-[#eeeeee] hover:bg-[#f7f7f7] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
        {/* Mobile stepper */}
        <div className="md:hidden px-4 pb-3">
          <Stepper steps={STEPS} current={step} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left panel */}
            <div className="flex-1 min-w-0 lg:max-w-[calc(100%-320px)]">
              {error && (
                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
                  {error}
                  <button onClick={() => setError('')} className="ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 1 && (
                <TypeSelector selected={qrType} onSelect={handleTypeSelect} />
              )}

              {step === 2 && (
                <ContentStep
                  type={qrType}
                  formData={formData}
                  onFormChange={setFormData}
                  name={name}
                  onNameChange={setName}
                />
              )}

              {step === 3 && (
                <DesignStep
                  styleData={styleData}
                  onChange={setStyleData}
                />
              )}

              {step === 4 && created && (
                <DownloadStep
                  qrCode={qrInstance}
                  shortlink={created.shortlink}
                  platform={qrType}
                  onDownloadComplete={handleCreateAnother}
                />
              )}
            </div>

            {/* Right panel - mobile preview */}
            <div className="hidden lg:block w-[300px] shrink-0">
              <div className="sticky top-20">
                <MobilePreview showQr={step >= 3}>
                  {step >= 2 && renderPreviewContent()}
                </MobilePreview>
                <div className="mt-4 flex justify-center">
                  {step >= 2 && renderQrPreview()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      {step < 4 && (
        <BottomBar
          current={step}
          total={4}
          onBack={prevStep}
          onNext={nextStep}
          onPreview={() => setPreviewOpen(true)}
          onSubmit={handleSubmit}
          loading={loading}
          canProceed={!!qrType}
        />
      )}

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPreviewOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#131d29]">QR Code Preview</h3>
              <button onClick={() => setPreviewOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7]">
                <X className="w-4 h-4 text-[#6e6e6e]" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div ref={qrContainerRef} className="bg-white rounded-xl p-3 border border-[#eeeeee]" />
              <div className="flex gap-2 w-full">
                <Button variant="primary" size="sm" className="flex-1" onClick={() => qrInstance?.download({ name: 'qr-code', extension: 'png' })}>
                  Download PNG
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => qrInstance?.download({ name: 'qr-code', extension: 'svg' })}>
                  Download SVG
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help/Tutorial modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeeeee] sticky top-0 bg-white">
              <h3 className="text-base font-bold text-[#131d29]">How to create a QR code</h3>
              <button onClick={() => setShowHelp(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7]">
                <X className="w-4 h-4 text-[#6e6e6e]" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {TUTORIAL_STEPS.map((t, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[#f3f0ff] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#8364ff]">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131d29]">{t.title}</h4>
                    <p className="text-xs text-[#6e6e6e] mt-1">{t.desc}</p>
                  </div>
                </div>
              ))}
              <Button variant="primary" className="w-full" onClick={() => setShowHelp(false)}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
