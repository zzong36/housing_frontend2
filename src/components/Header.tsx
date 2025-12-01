import { Menu, Settings, PanelLeftClose, PanelLeft } from 'lucide-react';

type LanguageCode = 'ko' | 'en' | 'zh' | 'vi';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
  language?: LanguageCode; // ✅ 추가
}

// 언어별 라벨 정의
const HEADER_LABELS: Record<LanguageCode, {
  title: string;
  menuOpen: string;
  sidebarToggle: string;
  settings: string;
}> = {
  ko: {
    title: '부동산 AI 어시스턴트',
    menuOpen: '메뉴 열기',
    sidebarToggle: '사이드바 토글',
    settings: '설정',
  },
  en: {
    title: 'Real Estate AI Assistant',
    menuOpen: 'Open menu',
    sidebarToggle: 'Toggle sidebar',
    settings: 'Settings',
  },
  zh: {
    title: '房产 AI 助手',
    menuOpen: '打开菜单',
    sidebarToggle: '切换侧边栏',
    settings: '设置',
  },
  vi: {
    title: 'Trợ lý AI Bất động sản',
    menuOpen: 'Mở menu',
    sidebarToggle: 'Bật/tắt thanh bên',
    settings: 'Cài đặt',
  },
};

export function Header({
  onToggleSidebar,
  onOpenSettings,
  isSidebarOpen,
  language = 'ko', // ✅ 기본값 한국어
}: HeaderProps) {
  const labels = HEADER_LABELS[language] ?? HEADER_LABELS.ko;

  return (
    <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* 좌측: 토글 버튼 */}
      <div className="flex items-center gap-3">
        {/* 모바일: 햄버거 메뉴 */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-gray-100/50 rounded-xl transition-all hover:scale-105 active:scale-95"
          aria-label={labels.menuOpen}
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        
        {/* 데스크탑: 사이드바 토글 버튼 */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:block p-2 hover:bg-gray-100/50 rounded-xl transition-all hover:scale-105 active:scale-95"
          aria-label={labels.sidebarToggle}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4.5 h-4.5 text-gray-400" />
          ) : (
            <PanelLeft className="w-4.5 h-4.5 text-gray-400" />
          )}
        </button>

        <h1 className="text-gray-800">{labels.title}</h1>
      </div>

      {/* 우측: 설정 버튼 */}
      <button
        onClick={onOpenSettings}
        className="p-2 hover:bg-gray-100/50 rounded-xl transition-all hover:scale-105 active:scale-95"
        aria-label={labels.settings}
      >
        <Settings className="w-5 h-5 text-gray-400" />
      </button>
    </header>
  );
}
