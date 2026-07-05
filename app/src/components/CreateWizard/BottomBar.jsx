import { cn } from '../../lib/cn';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight, Eye, Check, Loader2 } from 'lucide-react';

export default function BottomBar({
  current,
  total,
  onBack,
  onNext,
  onPreview,
  onSubmit,
  loading,
  canProceed = true
}) {
  const isLast = current === total;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#eeeeee] shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {current > 1 && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onPreview}>
            <Eye className="w-4 h-4" />
            Preview
          </Button>

          {isLast ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onSubmit}
              loading={loading}
              disabled={loading}
            >
              <Check className="w-4 h-4" />
              Create
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onNext}
              disabled={!canProceed}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
