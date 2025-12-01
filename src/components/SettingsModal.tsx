import { X, Check } from 'lucide-react';
import { themes } from '../utils/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeName: string;
  onThemeChange: (themeName: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export function SettingsModal({ isOpen, onClose, themeName, onThemeChange, language, onLanguageChange }: SettingsModalProps) {
  if (!isOpen) return null;

  const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-gray-900">설정</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 space-y-8">
            {/* 언어 선택 */}
            <div>
              <h3 className="text-gray-800 mb-4">언어 설정</h3>
              <p className="text-gray-600 mb-4">원하는 언어를 선택하세요</p>
              
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      onClose();
                    }}
                    className={`relative flex items-center gap-2 p-3 rounded-xl transition-all ${
                      language === lang.code 
                        ? 'bg-teal-50 border-2 border-teal-400' 
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                    }`}
                    aria-label={`${lang.label} 선택`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="text-gray-700 flex-1 text-left">{lang.label}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-teal-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 테마 선택 */}
            <div>
              <h3 className="text-gray-800 mb-4">테마 선택</h3>
              <p className="text-gray-600 mb-4">원하는 테마를 선택하세요</p>
              
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      onThemeChange(theme.name);
                      onClose();
                    }}
                    className="relative flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    aria-label={`${theme.displayName} 테마 선택`}
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-6 h-12 rounded-l-full"
                        style={{ backgroundColor: theme.botBubble }}
                      />
                      <div
                        className="w-6 h-12 rounded-r-full"
                        style={{ backgroundColor: theme.userBubble }}
                      />
                    </div>
                    {themeName === theme.name && (
                      <div className="absolute top-1 right-1">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                    <span className="text-gray-700">{theme.displayName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}