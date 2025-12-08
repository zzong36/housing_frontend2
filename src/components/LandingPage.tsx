import { Home } from 'lucide-react';
// Update the path below to the actual mascot image location in your project
import mascotImage from '../assets/mascot.png';
import '../utils/style.css';
import homebridgeLogo from '../assets/homebridge_logo.png';
import Logo from "../components/Logo";


interface LandingPageProps {
  onLanguageSelect: (language: string) => void;
}

export function LandingPage({ onLanguageSelect }: LandingPageProps) {
  const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* 좌측 하단 마스코트 */}
      <div className="absolute bottom-0 left-0 pointer-events-none z-0">
        <img 
          src={mascotImage} 
          alt="K-부동산 마스코트" 
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain"
        />
      </div>

      <div className="text-center px-6 relative z-10">
        {/* 로고 */}
{/* 로고 이미지 */}
    <div>
      <Logo src={homebridgeLogo} size={160} />
    </div>



        {/* 앱 이름 */}
        <h1 className="text-5xl sm:text-6xl mb-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent animate-fade-in-up tracking-tight">
          홈브릿지
        </h1>
        
        <p className="text-gray-500 mb-12 animate-fade-in-up delay-100 tracking-wide">
          AI 기반 부동산 상담 서비스
        </p>

        {/* 언어 선택 */}
        <div className="animate-fade-in-up delay-200">
          <p className="text-gray-600 mb-5 tracking-wide">언어를 선택해주세요</p>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-lg mx-auto">
            {languages.map((lang, index) => (
              <button
                key={lang.code}
                onClick={() => onLanguageSelect(lang.code)}
                className="group relative px-5 py-2.5 bg-white backdrop-blur-md rounded-full shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-gray-200 hover:border-teal-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-gray-700 group-hover:text-teal-600 transition-colors">
                    {lang.label}
                  </span>
                </div>
                {/* Hover 효과 - 그라데이션 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-50/0 via-emerald-50/0 to-teal-50/0 group-hover:from-teal-50/60 group-hover:via-emerald-50/60 group-hover:to-teal-50/60 transition-all duration-300"></div>
              </button>
            ))}
          </div>
        </div>

        {/* 하단 장식 텍스트 */}
        <p className="mt-12 text-gray-400 animate-fade-in-up delay-300 tracking-wider">
          Powered by AI
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-75 {
          animation-delay: 75ms;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
