import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 animate-bounce-in border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
        
        {/* Cabecera */}
        <div className={`p-6 flex items-start gap-4 border-b ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
            <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                <AlertTriangle size={24} />
            </div>
            <div>
                <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{message}</p>
            </div>
        </div>

        {/* Botones */}
        <div className={`p-4 flex justify-end gap-3 bg-opacity-50 ${darkMode ? 'bg-slate-950/50' : 'bg-gray-50'}`}>
            <button 
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-gray-200'}`}
            >
                {cancelText}
            </button>
            <button 
                onClick={() => { onConfirm(); onClose(); }}
                className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition transform hover:scale-105 flex items-center gap-2 text-white ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isDestructive ? <X size={16}/> : <Check size={16}/>} {confirmText}
            </button>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounceIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};