import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AlertDialogProps {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function AlertDialog({
  title, message, type = 'info', onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel'
}: AlertDialogProps) {
  const isConfirm = !!onCancel;
  
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const iconColor = type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : type === 'warning' ? 'text-amber-500' : 'text-blue-500';
  const iconBg = type === 'success' ? 'bg-green-50' : type === 'error' ? 'bg-red-50' : type === 'warning' ? 'bg-amber-50' : 'bg-blue-50';
  const btnClass = type === 'error' || type === 'warning' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${iconBg} ${iconColor} shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          {isConfirm && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors shadow-sm ${btnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
