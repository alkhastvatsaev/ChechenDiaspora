import { X, BookOpen, MessageCircle, ExternalLink, Globe2 } from 'lucide-react';
import React from 'react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-safe-top pb-safe-bottom animate-fade-in-up">
      <div 
        className="absolute inset-0 bg-apple-dark/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full transition-colors z-10"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header Header */}
        <div className="pt-10 pb-6 px-8 text-center bg-apple-light/50 border-b border-black/5">
          <div className="w-16 h-16 bg-chechen-green/10 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-chechen-green" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-apple-dark">Учи Чеченский Язык</h2>
          <p className="text-gray-500 mt-2 font-medium text-sm">Лучшая онлайн-школа для диаспоры</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="bg-gradient-to-br from-chechen-green/5 to-transparent p-5 rounded-2xl border border-chechen-green/10">
            <h3 className="font-bold text-lg text-apple-dark mb-1 flex items-center gap-2">
              <Globe2 size={18} className="text-chechen-green" /> ISHKOLA
            </h3>
            <p className="text-sm text-gray-500">
              Проверенная онлайн-школа с 13-летним опытом. Высший стандарт качества.
            </p>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-apple-light flex items-center justify-center shrink-0">
                <span className="font-bold text-gray-400 text-xs">01</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">Для начинающих</p>
                <p className="text-sm text-gray-500">Спецкурс с нуля. Вы заговорите с первого же урока.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-apple-light flex items-center justify-center shrink-0">
                <span className="font-bold text-gray-400 text-xs">02</span>
              </div>
              <div>
                <p className="font-bold text-gray-800">English Friendly</p>
                <p className="text-sm text-gray-500">Преподаватели свободно владеют английским языком.</p>
              </div>
            </li>
          </ul>

          <div className="pt-6 space-y-3 border-t border-black/5">
            <a 
              href="https://wa.me/79282905389" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp: +7 928 290 53 89
            </a>
            
            <a 
              href="https://ishkola.com/chechen-language/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-apple-dark text-white hover:bg-black font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-black/10"
            >
              <ExternalLink size={20} className="opacity-70" />
              Перейти на сайт ISHKOLA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
