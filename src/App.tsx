import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { getTheme } from './utils/themes';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [themeName, setThemeName] = useState('winter'); // 기본 민트 테마
  const [chatSessions, setChatSessions] = useState([
    { id: '1', title: '서울 강남구 아파트 문의', timestamp: new Date() }
  ]);
  const [currentChatId, setCurrentChatId] = useState('1');

  const currentTheme = getTheme(themeName);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanding(false);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleGoHome = () => {
    setShowLanding(true);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: '새 대화',
      timestamp: new Date()
    };
    setChatSessions([newChat, ...chatSessions]);
    setCurrentChatId(newChat.id);
    // 모바일에서 새 채팅 시 사이드바 닫기
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    // 모바일에서 채팅 선택 시 사이드바 닫기
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // 랜딩 페이지 표시
  if (showLanding) {
    return <LandingPage onLanguageSelect={handleLanguageSelect} />;
  }

  // 챗봇 화면
  return (
    <div 
      className="flex h-screen overflow-hidden" 
      style={{ fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif' }}
    >
      <style>
        @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");
      </style>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onGoHome={handleGoHome}
        theme={currentTheme}
        language={selectedLanguage}   // 🔹 추가
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isSidebarOpen={isSidebarOpen}
          language="en"   // ko | en | zh | vi
        />
        
        {/* 🔹 여기 추가 */}
        <ChatArea 
          currentChatId={currentChatId}
          theme={currentTheme}
          language={selectedLanguage || 'ko'}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeName={themeName}
        onThemeChange={setThemeName}
        language={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}