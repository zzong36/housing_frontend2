import { X, MessageSquarePlus, Home } from 'lucide-react';
import { Theme } from '../utils/themes';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onGoHome: () => void;
  theme: Theme;
  language: string; // 🔹 추가
}

// 🔹 언어별 문구 정의
const SIDEBAR_I18N: Record<
  string,
  {
    title: string;
    home: string;
    newChat: string;
  }
> = {
  ko: {
    title: '부동산 챗봇',
    home: '홈으로',
    newChat: '새 채팅',
  },
  en: {
    title: 'Real Estate Chatbot',
    home: 'Go Home',
    newChat: 'New Chat',
  },
  zh: {
    title: '房产聊天助手',
    home: '回到首页',
    newChat: '新对话',
  },
  vi: {
    title: 'Trợ lý bất động sản',
    home: 'Về trang chính',
    newChat: 'Cuộc trò chuyện mới',
  },
};

function getSidebarTexts(lang: string) {
  return SIDEBAR_I18N[lang] || SIDEBAR_I18N['ko'];
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  onNewChat,
  onGoHome,
  theme,
  language,
}: SidebarProps) {
  const t = getSidebarTexts(language);

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* 사이드바 */}
      <aside
        className={`
          fixed md:relative
          top-0 left-0 h-full
          w-64 bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isOpen && 'md:hidden'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-gray-800">{t.title}</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* 홈 버튼 
          <div className="p-5">
            <button
              onClick={onGoHome}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: theme.userBubble }}
            >
              <Home className="w-5 h-5" />
              <span>{t.home}</span>
            </button>
          </div>*/}

          {/* 새 채팅 버튼 */}
          <div className="p-5">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: theme.userBubble }}
            >
              <MessageSquarePlus className="w-5 h-5" />
              <span>{t.newChat}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
