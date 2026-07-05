import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQR } from '../hooks/useQR';
import { QR_TYPE_LIST } from '../lib/qr-types';
import { generateQRCode, downloadQRPNG, downloadQRSVG } from '../lib/qr-generator';
import Stepper from '../components/ui/Stepper';
import Button from '../components/ui/Button';
import TypeSelector from '../components/CreateWizard/TypeSelector';
import ContentStep from '../components/CreateWizard/ContentStep';
import DesignStep from '../components/CreateWizard/DesignStep';
import MobilePreview from '../components/MobilePreview/MobilePreview';
import { renderPreviewForType } from '../components/CreateWizard/TypePreviews';
import { HelpCircle, X, ArrowLeft } from 'lucide-react';

const STEPS = [
  { label: 'Seleccionar tipo' },
  { label: 'Agregar contenido' },
  { label: 'Diseñar código QR' },
  { label: 'Descargar código QR' }
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
    qr_frame_text: 'Escanear',
    qr_frame_text_color: '#000000',
    qr_image_size: 0.4,
    qr_image_margin: 0,
    qr_error_correction: 'H',
    qr_logo_path: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);
  const [qrRef, setQrRef] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const qrContainerRef = useRef(null);
  const previewUrl = `${import.meta.env.VITE_WORKER_URL}/q/preview`;

  const updateQR = useCallback(() => {
    if (!qrContainerRef.current) return;
    const size = 200;
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
      width: size,
      height: size
    });
    setQrRef(qr);
    const el = qrContainerRef.current;
    el.innerHTML = '';
    qr.append(el);
  }, [styleData, previewUrl]);

  useEffect(() => { updateQR(); }, [updateQR]);

  const handleTypeSelect = (type) => {
    setQrType(type);
    setStep(2);
  };

  const validateStep = () => {
    if (step === 1 && !qrType) return 'Seleccioná un tipo de QR';
    if (step === 2 && !name.trim()) return 'El nombre del QR es obligatorio';
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
    if (!name.trim()) { setError('El nombre del QR es obligatorio'); return; }
    setLoading(true);
    setError('');

    const { expires_at, max_scans, ...cleanStyle } = styleData;
    try {
      const payload = { platform: qrType, name, ...formData, ...cleanStyle };
      const qr = await createQR(payload);
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
    setCreated(null);
    setError('');
  };

  const handleTypeChange = () => {
    setStep(1);
    setQrType('');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#e8e8ed]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="10" fill="#8364ff" />
              <rect x="8" y="8" width="18" height="18" rx="2.5" stroke="white" strokeWidth="1.5" fill="none" />
              <rect x="11" y="11" width="12" height="12" rx="1.5" stroke="white" strokeWidth="1.5" fill="none" />
              <rect x="14" y="14" width="6" height="6" rx="1" fill="white" />
            </svg>
            <span className="text-sm font-bold text-[#131d29] hidden md:inline">QR Generator</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <Stepper steps={STEPS} current={step} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7] transition-colors"
              title="Ayuda"
            >
              <HelpCircle className="w-4 h-4 text-[#6e6e6e]" />
            </button>
            <Link
              to="/dashboard"
              className="h-8 px-3 flex items-center text-xs font-semibold text-[#6e6e6e] hover:text-[#131d29] rounded-lg border border-[#e0e0e0] hover:bg-[#f7f7f7] transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3">
          <Stepper steps={STEPS} current={step} />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between max-w-3xl">
              {error}
              <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 lg:max-w-[calc(100%-320px)]">
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
                <div className="flex flex-col items-center text-center space-y-6 py-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#f3f0ff] flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8364ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#131d29] mb-1">¡Tu código QR está listo!</h2>
                    <p className="text-sm text-[#6e6e6e]">
                      Podés descargarlo o compartir el enlace.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <Button variant="primary" onClick={() => qrRef?.download({ name: 'qr-code', extension: 'png' })}>
                      Descargar PNG
                    </Button>
                    <Button variant="outline" onClick={() => qrRef?.download({ name: 'qr-code', extension: 'svg' })}>
                      Descargar SVG
                    </Button>
                    <Button variant="outline" onClick={handleCreateAnother}>
                      Crear otro
                    </Button>
                    <Link to="/dashboard">
                      <Button variant="primary">
                        Ir al panel
                      </Button>
                    </Link>
                  </div>
                  {created.shortlink && (
                    <div className="w-full max-w-sm">
                      <p className="text-xs text-[#6e6e6e] mb-1.5">Compartí este enlace:</p>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={created.shortlink}
                          className="flex-1 h-10 rounded-lg border border-[#e0e0e0] bg-[#f7f7f7] px-3 text-xs text-[#6e6e6e] truncate"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(created.shortlink)}
                        >
                          Copiar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden lg:block w-[300px] shrink-0">
              <div className="sticky top-20">
                <MobilePreview
                  tabs
                  qrTabEnabled={step >= 2}
                  defaultTab={step === 1 ? 0 : (qrType ? 1 : 0)}
                >
                  {step >= 2 && qrType && renderPreviewForType(qrType, formData)}
                </MobilePreview>
                <div
                  ref={qrContainerRef}
                  className="mt-4 flex justify-center min-h-[200px] items-start"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e8ed] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div>
              {step > 1 && (
                <Button variant="outline" size="md" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {step === 1 && (
                <Button variant="primary" size="md" onClick={nextStep} disabled={!qrType}>
                  Siguiente
                </Button>
              )}
              {step === 2 && (
                <Button variant="primary" size="md" onClick={nextStep}>
                  Guardar
                </Button>
              )}
              {step === 3 && (
                <Button variant="primary" size="md" onClick={handleSubmit} loading={loading}>
                  Crear
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeeeee]">
              <h3 className="text-base font-bold text-[#131d29]">Cómo crear un código QR</h3>
              <button onClick={() => setShowHelp(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f7f7f7]">
                <X className="w-4 h-4 text-[#6e6e6e]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { title: '1. Seleccioná un tipo', desc: 'Elegí entre 16 tipos de códigos QR según lo que quieras compartir.' },
                { title: '2. Agregá el contenido', desc: 'Completá los datos. Mirá la vista previa en el teléfono a la derecha.' },
                { title: '3. Diseñá tu QR', desc: 'Personalizá colores, patrón, marco y logo. Probá escanearlo antes de descargar.' },
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#f3f0ff] flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#8364ff]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#131d29]">{t.title}</p>
                    <p className="text-xs text-[#6e6e6e] mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
              <Button variant="primary" className="w-full" onClick={() => setShowHelp(false)}>
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
