import React from 'react';
import { Info, X } from 'lucide-react';

export const TutorialModal = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-slate-700 transform transition-all scale-100 animate-bounce-in">
        
        {/* Cabecera Elegante */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Info size={22} className="text-white/90" /> Guía Rápida
          </h3>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <h4 className="text-xl font-black mb-3 text-slate-800 dark:text-white flex items-center gap-2">
            {content.emoji} {content.title}
          </h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
            {content.text}
          </p>
        </div>

        {/* Footer con Botón */}
        <div className="p-4 bg-gray-50 dark:bg-slate-950/50 flex justify-end border-t border-gray-100 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition transform hover:scale-105"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
      
      {/* Estilos para animación de entrada */}
      <style>{`
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounceIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};