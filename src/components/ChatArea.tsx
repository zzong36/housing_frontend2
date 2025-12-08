// src/components/ChatArea.tsx
import { useState, useEffect } from 'react';
import {
  Send,
  User,
  Download,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Slider from 'react-slick';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Theme } from '../utils/themes';
import mascotImage from '../assets/mascot.png';
import loadingAnimation from '../assets/loading.json';
import Lottie from 'lottie-react';
import room1 from '../assets/apartment/room1.png';
import room2 from '../assets/apartment/room2.png';
import room3 from '../assets/apartment/room3.png';
import room4 from '../assets/apartment/room4.png';
import room5 from '../assets/apartment/room5.png';
import room6 from '../assets/apartment/room6.png';
import room7 from '../assets/apartment/room7.png';
import room8 from '../assets/apartment/room8.png';
import room9 from '../assets/apartment/room9.png';
import room10 from '../assets/apartment/room10.png';
import room11 from '../assets/apartment/room11.png';
import room12 from '../assets/apartment/room12.png';
import room13 from '../assets/apartment/room13.png';
import room14 from '../assets/apartment/room14.png';
import room15 from '../assets/apartment/room15.png';
import room16 from '../assets/apartment/room16.png';


interface ChatAreaProps {
  currentChatId: string;
  theme: Theme;
  language: string; // ko, en, zh, vi ...
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  rooms: number;
  bathrooms: number;
  imageUrl?: string;
  type: string;

  // 🔥 추천 전용 필드들
  nearestStoreName?: string;
  nearestSubway?: string;
  nearestSubwayDistanceKm?: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  chartData?: {
    type: 'line' | 'bar';
    data: any[];
    title: string;
  };
  tableData?: {
    headers: string[];
    rows: any[][];
    title: string;
  };
  propertyData?: Property[];
  sqlQuery?: string;
  mode?: 'sql' | 'rag' | 'recommend';

    // 🔥 RAG 출처
  sources?: string[];
}

interface AutoChatApiResponse {
  mode?: 'sql' | 'rag' | 'recommend';
  answer?: string;
  sql?: string | null;
  data?: {
    columns: string[];
    rows: any[];
  } | null;
  sources?: string[] | null;

  // 🔥 추천 컨텍스트 (백엔드에서 내려줄 수 있음)
  gu?: string | null;
  min_rent?: number | null;
  max_rent?: number | null;
  top_k?: number | null;
}

interface RecommendContext {
  gu?: string;
  min_rent?: number;
  max_rent?: number;
  top_k?: number;
}

// 🔹 언어별 텍스트
const CHAT_I18N: Record<
  string,
  {
    initialBotMessage: string;
    inputPlaceholder: string;
    defaultSqlAnswer: string;
    errorPrefix: string;
    sourcesTitle: string;   // 🔥 추가
  }
> = {
  ko: {
    initialBotMessage: '안녕하세요! 부동산 AI 어시스턴트입니다. 어떤 매물을 찾고 계신가요?',
    inputPlaceholder: '부동산에 대해 무엇이든 물어보세요...',
    defaultSqlAnswer: 'DB 조회가 완료되었습니다. 자세한 내용은 아래 표와 차트를 확인해 주세요.',
    errorPrefix: 'DB 질의 중 오류가 발생했어요: ',
    sourcesTitle: '출처',   // 🔥
  },
  en: {
    initialBotMessage:
      "Hello! I'm your real-estate AI assistant. What kind of property are you looking for?",
    inputPlaceholder: 'Ask me anything about real estate...',
    defaultSqlAnswer:
      'The database query is complete. Please check the table and chart below for details.',
    errorPrefix: 'An error occurred while querying the DB: ',
    sourcesTitle: 'Sources',   // 🔥
  },
  zh: {
    initialBotMessage: '你好！我是房产 AI 助手。你想找什么样的房源？',
    inputPlaceholder: '关于韩国房产，想问什么都可以…',
    defaultSqlAnswer: '数据库查询已完成，请查看下方的表格和图表。',
    errorPrefix: '数据库查询时发生错误：',
    sourcesTitle: '参考资料',   // 🔥
  },
  vi: {
    initialBotMessage:
      'Xin chào! Tôi là trợ lý bất động sản AI. Bạn đang tìm loại nhà nào?',
    inputPlaceholder: 'Hãy hỏi bất cứ điều gì về bất động sản Hàn Quốc...',
    defaultSqlAnswer:
      'Truy vấn DB đã hoàn thành. Hãy xem bảng và biểu đồ bên dưới nhé.',
    errorPrefix: 'Đã xảy ra lỗi khi truy vấn DB: ',
    sourcesTitle: 'Nguồn tham khảo',   // 🔥
  },
};

function getTexts(lang: string) {
  return CHAT_I18N[lang] || CHAT_I18N.ko;
}

const COLUMN_LABELS = {
  ko: {
    grfe: "보증금",
    rtfe: "월세",
    rent_area: "면적",
    cgg_nm: "구",
    stdg_nm: "동",
  },
  en: {
    grfe: "Deposit",
    rtfe: "Monthly Rent",
    rent_area: "Area",
    cgg_nm: "District",
    stdg_nm: "Neighborhood",
  },
  zh: {
    grfe: "押金",
    rtfe: "月租",
    rent_area: "面积",
    cgg_nm: "区",
    stdg_nm: "洞/街道",
  },
  vi: {
    grfe: "Tiền cọc",
    rtfe: "Tiền thuê",
    rent_area: "Diện tích",
    cgg_nm: "Quận",
    stdg_nm: "Phường",
  },
} as const;


const API_BASE = 'http://54.180.106.181:9000';

export function ChatArea({ currentChatId, theme, language }: ChatAreaProps) {
  const texts = getTexts(language);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔥 추천용 컨텍스트 (구, 예산 범위, top_k)
  const [recommendContext, setRecommendContext] = useState<RecommendContext>({
    top_k: 3,
  });

  const chartColor = theme.chartBackground || '#4f46e5';
const fallbackImages = [
  room1, room2, room3, room4,
  room5, room6, room7, room8,
  room9, room10, room11, room12,
  room13, room14, room15, room16
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const shuffledImages = shuffle(fallbackImages);

  

  // 채팅/언어 변경 시 초기화
  useEffect(() => {
    const t = getTexts(language);
    setMessages([
      {
        id: '1',
        text: t.initialBotMessage,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    setRecommendContext({ top_k: 3 });
  }, [currentChatId, language]);

  const downloadCSV = (headers: string[], rows: any[][], filename: string) => {
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const question = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/chat/auto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          language,
          gu: recommendContext.gu,
          min_rent: recommendContext.min_rent,
          max_rent: recommendContext.max_rent,
          top_k: recommendContext.top_k,
        }),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data: AutoChatApiResponse = await resp.json();
      console.log('🔄 /chat/auto response:', data);

      // ✅ 현재 응답 모드
      const mode: Message['mode'] = data.mode || 'rag';

      // 🔥 recommend 모드일 때 서버에서 내려준 컨텍스트 반영
      if (mode === 'recommend') {
        setRecommendContext((prev) => ({
          gu: data.gu ?? prev.gu,
          min_rent:
            typeof data.min_rent === 'number'
              ? data.min_rent
              : prev.min_rent,
          max_rent:
            typeof data.max_rent === 'number'
              ? data.max_rent
              : prev.max_rent,
          top_k:
            typeof data.top_k === 'number'
              ? data.top_k
              : prev.top_k ?? 3,
        }));
      }

      const sql = data.sql || '';
      const answer = data.answer || texts.defaultSqlAnswer;
      const tableDataRaw = data.data;

      // 🔹 표 데이터 변환 (⭐ recommend 모드에서는 생성 안 함)
      let tableData: Message['tableData'] | undefined = undefined;
const lang = language ?? "ko"; // props 또는 context에서 가져옴

const translatedHeaders =
  tableDataRaw && Array.isArray(tableDataRaw.columns)
    ? tableDataRaw.columns.map(col =>
        COLUMN_LABELS[lang]?.[col] ?? col // 없으면 원본 그대로 fallback
      )
    : [];

      if (
        mode !== 'recommend' &&
        tableDataRaw &&
        tableDataRaw.rows &&
        tableDataRaw.rows.length > 0
      ) {
        const normalizedRows: any[][] = tableDataRaw.rows.map((row: any) => {
          if (Array.isArray(row)) {
            return row;
          }
          if (row && typeof row === 'object') {
            return tableDataRaw.columns.map((col: string) => (row as any)[col]);
          }
          return [row];
        });

        tableData = {
  title: lang === "ko" ? "조회 결과" :
         lang === "en" ? "Search Results" :
         lang === "zh" ? "查询结果" :
         lang === "vi" ? "Kết quả truy vấn" :
         "Result",

  headers: translatedHeaders,   // 🔥 언어별로 변경됨
  rows: normalizedRows,
};

      }

      // 🔹 차트 데이터 (예시: gu, deal_price 있을 때 구별 평균)
      let chartData: Message['chartData'] | undefined = undefined;
      if (
        tableDataRaw &&
        Array.isArray(tableDataRaw.columns) &&
        tableDataRaw.columns.includes('gu') &&
        tableDataRaw.columns.includes('deal_price')
      ) {
        const guIndex = tableDataRaw.columns.indexOf('gu');
        const priceIndex = tableDataRaw.columns.indexOf('deal_price');

        const grouped: Record<string, { sum: number; count: number }> = {};

        for (const row of tableDataRaw.rows) {
          const rowArr = Array.isArray(row)
            ? row
            : tableDataRaw.columns.map((col: string) => (row as any)[col]);

          const gu = rowArr[guIndex];
          const price = Number(rowArr[priceIndex]);
          if (!Number.isFinite(price)) continue;

          if (!grouped[gu]) grouped[gu] = { sum: 0, count: 0 };
          grouped[gu].sum += price;
          grouped[gu].count += 1;
        }

        const chartRows = Object.entries(grouped).map(([gu, { sum, count }]) => ({
          name: gu,
          평균가: sum / count,
        }));

        chartData = {
          type: 'bar',
          title: '구별 평균 거래금액',
          data: chartRows,
        };
      }

      // 🔥 추천 모드일 때 DF → 카드용 propertyData 변환
      let propertyData: Property[] | undefined = undefined;
      if (mode === 'recommend' && tableDataRaw && Array.isArray(tableDataRaw.rows)) {
        propertyData = tableDataRaw.rows.map((row: any, index: number) => {
          const rec: any = Array.isArray(row)
            ? Object.fromEntries(
                tableDataRaw.columns.map((col: string, i: number) => [col, row[i]]),
              )
            : row;

          const id = rec.id ?? index;
          const cgg_nm = rec.cgg_nm ?? '';
          const stdg_nm = rec.stdg_nm ?? '';
          const mno = rec.mno ?? '';
          const sno = rec.sno ?? '';
          const bldg_nm = rec.bldg_nm ?? '이름 없는 건물';
          const rtfe = rec.rtfe;
          const grfe = rec.grfe;
          const rent_area = rec.rent_area;
          const nearest_store_name = rec.nearest_store_name;
          const nearest_subway_station = rec.nearest_subway_station;
          const nearest_subway_distance_km = rec.nearest_subway_distance_km;

          const locationPieces = [
            cgg_nm,
            stdg_nm,
            [mno, sno].filter(Boolean).join('-'),
          ].filter(Boolean);
          const location = locationPieces.join(' ');

          const priceParts: string[] = [];
          if (rtfe != null) priceParts.push(`rent ${rtfe * 10000} won`);
          if (grfe != null) priceParts.push(`deposit ${grfe * 10000} won`);

          // 🔥 로컬 아파트 이미지 중 하나 선택 (index 기반으로 섞기)
          const fallbackImage = shuffledImages[index % shuffledImages.length];


          return {
            id: String(id),
            title: bldg_nm,
            location: location,
            price: priceParts.join(' · '),
            area: rent_area != null ? `${rent_area}㎡` : '',
            rooms: 0,
            bathrooms: 0,
            type: 'recommended',
            imageUrl: fallbackImage, // ⬅️ 여기!
            nearestStoreName: nearest_store_name ?? undefined,
            nearestSubway: nearest_subway_station ?? undefined,
            nearestSubwayDistanceKm:
              nearest_subway_distance_km != null
                ? Number(nearest_subway_distance_km)
                : undefined,
          };
        });
      }

      console.log('📌 생성된 SQL:', sql);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'bot',
        timestamp: new Date(),
        sqlQuery: sql,
        tableData,
        chartData,
        propertyData,
        mode, // ✅ 여기서 mode 저장!
        sources: data.sources ?? undefined,   // 🔥 여기!
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `${texts.errorPrefix}${err?.message || String(err)}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* AI 아바타 (왼쪽) */}
              {message.sender === 'bot' && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white shadow-sm">
                  <img
                    src={mascotImage}
                    alt="AI 마스코트"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 말풍선 + 부가 콘텐츠 */}
              <div
                className={`flex flex-col ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                } ${
                  message.chartData || message.tableData || message.propertyData
                    ? 'max-w-[90%] md:max-w-[80%]'
                    : 'max-w-[75%] md:max-w-[60%]'
                }`}
              >
                <div
                  className={`
                    relative px-4 py-3 rounded-2xl w-full
                    ${message.sender === 'user' ? 'text-white rounded-tr-sm' : 'rounded-tl-sm'}
                  `}
                  style={{
                    backgroundColor:
                      message.sender === 'user' ? theme.userBubble : theme.botBubble,
                  }}
                >
                  {/* 말풍선 꼬리 */}
                  {message.sender === 'bot' ? (
                    <div
                      className="absolute -left-2 top-0 w-0 h-0"
                      style={{
                        borderTop: `8px solid ${theme.botBubble}`,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                      }}
                    />
                  ) : (
                    <div
                      className="absolute -right-2 top-0 w-0 h-0"
                      style={{
                        borderTop: `8px solid ${theme.userBubble}`,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                      }}
                    />
                  )}

                  {/* 텍스트 */}
                  <p
                    style={{
                      color:
                        message.sender === 'user'
                          ? theme.userTextColor || '#ffffff'
                          : theme.botTextColor || '#1f2937',
                    }}
                  >
                    {message.text}
                  </p>

                  {/* 🔥 RAG 출처 표시 */}
{message.sender === 'bot' &&
  message.mode === 'rag' &&
  message.sources &&
  message.sources.length > 0 && (
    <div className="mt-3 bg-white p-4 rounded-lg shadow-sm text-sm sm:text-base text-gray-700">
      <div className="font-bold mb-2 text-gray-800 text-base sm:text-lg">
        {texts.sourcesTitle}
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {message.sources.map((src, idx) => (
          <li key={idx} className="leading-relaxed break-words">
            {src}
          </li>
        ))}
      </ul>
    </div>
  )}


                  {/* 그래프 */}
                  {message.chartData && message.sender === 'bot' && (
                    <div className="mt-4 p-4 rounded-xl bg-white">
                      <h4 className="text-gray-700 mb-3 text-xs sm:text-sm md:text-base">
                        {message.chartData.title}
                      </h4>
                      <div className="w-full" style={{ minHeight: '200px' }}>
                        <ResponsiveContainer width="100%" height={300} minHeight={200}>
                          {message.chartData.type === 'line' ? (
                            <LineChart data={message.chartData.data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="month"
                                tick={{ fontSize: 'clamp(10px, 2vw, 14px)' }}
                              />
                              <YAxis tick={{ fontSize: 'clamp(10px, 2vw, 14px)' }} />
                              <Tooltip
                                contentStyle={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
                              />
                              <Legend
                                wrapperStyle={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
                              />
                              <Line
                                type="monotone"
                                dataKey="가격"
                                stroke={chartColor}
                                strokeWidth={2}
                                dot={{ fill: chartColor, r: 4 }}
                              />
                            </LineChart>
                          ) : (
                            <BarChart data={message.chartData.data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                tick={{ fontSize: 'clamp(10px, 2vw, 14px)' }}
                              />
                              <YAxis tick={{ fontSize: 'clamp(10px, 2vw, 14px)' }} />
                              <Tooltip
                                contentStyle={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
                              />
                              <Legend
                                wrapperStyle={{ fontSize: 'clamp(11px, 2vw, 14px)' }}
                              />
                              <Bar dataKey="평균가" fill={chartColor} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* 표 */}
                  {message.tableData &&
                    message.sender === 'bot' &&
                    message.mode !== 'recommend' && (
                      <div className="mt-4 p-4 rounded-xl bg-white">
                        <h4 className="text-gray-700 mb-3">{message.tableData.title}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                            <thead>
                              <tr style={{ backgroundColor: chartColor + '80' }}>
                                {message.tableData.headers.map((header, index) => (
                                  <th
                                    key={index}
                                    className="px-2 sm:px-3 md:px-4 py-2 text-left text-gray-700 border border-gray-200 whitespace-nowrap"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {message.tableData.rows.map((row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className="hover:bg-gray-100 transition-colors"
                                >
                                  {row.map((cell, cellIndex) => (
                                    <td
                                      key={cellIndex}
                                      className="px-2 sm:px-3 md:px-4 py-2 text-gray-800 border border-gray-200 whitespace-nowrap"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-end mt-3">
                          <button
                            onClick={() =>
                              downloadCSV(
                                message.tableData!.headers,
                                message.tableData!.rows,
                                `${message.tableData!.title}.csv`,
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: theme.userBubble }}
                            aria-label="CSV 다운로드"
                          >
                            <Download className="w-4 h-4" />
                            <span>CSV</span>
                          </button>
                        </div>
                      </div>
                    )}

                  {/* 🔥 추천 카드 캐러셀 */}
                  {message.propertyData && message.sender === 'bot' && (
                    <div className="mt-4">
                      <div className="property-carousel-wrapper">
                        <Slider
                          dots={true}
                          infinite={true}
                          speed={500}
                          slidesToShow={1}
                          slidesToScroll={1}
                          arrows={false}
                          nextArrow={<NextArrow themeColor={theme.userBubble} />}
                          prevArrow={<PrevArrow themeColor={theme.userBubble} />}
                          responsive={[
                            {
                              breakpoint: 9999,
                              settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                arrows: true,
                              },
                            },
                            {
                              breakpoint: 1024,
                              settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                arrows: true,
                              },
                            },
                            {
                              breakpoint: 768,
                              settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: false,
                              },
                            },
                          ]}
                        >
                          {message.propertyData.map((property) => (
                            <div key={property.id} className="px-2">
                              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                                {/* 이미지 */}
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                  <ImageWithFallback
                                    src={
                                      property.imageUrl ||
                                      'https://images.unsplash.com/photo-1654506012740-09321c969dc2?w=400&h=300&fit=crop'
                                    }
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <div
                                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs"
                                    style={{ backgroundColor: theme.userBubble }}
                                  >
                                    {property.type}
                                  </div>
                                </div>

                                {/* 내용 */}
                                <div className="p-4">
                                  <h5 className="text-gray-800 mb-2">
                                    {property.title}
                                  </h5>

                                  {/* 위치: cgg_nm stdg_nm mno-sno */}
                                  <div className="flex items-center gap-1 text-gray-600 mb-2 text-xs sm:text-sm">
                                    <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                    <span className="truncate">
                                      {property.location}
                                    </span>
                                  </div>

                                  {/* 월세 / 보증금 */}
                                  <div className="text-gray-900 mb-3 text-sm">
                                    {property.price}
                                  </div>

                                  {/* 면적 + 지하철 + 마트 */}
                                  <div className="flex flex-col gap-1 text-gray-600 text-xs sm:text-sm">
                                    {/* 면적 */}
                                    {property.area && (
                                      <div className="flex items-center gap-1">
                                        <Maximize className="w-4 h-4 text-gray-400" />
                                        <span>{property.area}</span>
                                      </div>
                                    )}

                                    {/* 지하철 */}
                                    {property.nearestSubway && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>
                                          {property.nearestSubway}역
                                          {property.nearestSubwayDistanceKm != null &&
                                            ` · ${property.nearestSubwayDistanceKm.toFixed(
                                              1,
                                            )}km`}
                                        </span>
                                      </div>
                                    )}

                                    {/* 인근 마트 */}
                                    {property.nearestStoreName && (
                                      <div className="flex items-center gap-1">
                                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                                        <span>{property.nearestStoreName}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Slider>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 사용자 아바타 */}
              {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {/* 로딩 Lottie */}
          {loading && (
            <div className="flex justify-center pt-4 pb-5">
              <Lottie
                animationData={loadingAnimation}
                loop
                autoplay
                style={{ width: 120, height: 120 }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-4 flex-shrink-0 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end bg-gray-50/80 rounded-2xl p-2 border border-gray-200/50">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={texts.inputPlaceholder}
              className="flex-1 resize-none bg-transparent px-4 py-2.5 focus:outline-none max-h-32 placeholder:text-gray-400"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-sm"
              style={{ backgroundColor: theme.userBubble }}
              aria-label="전송"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

interface ArrowProps {
  themeColor: string;
  onClick?: () => void;
}

function NextArrow({ themeColor, onClick }: ArrowProps) {
  return (
    <div
      className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer shadow-lg hover:scale-110 transition-transform"
      style={{ backgroundColor: themeColor }}
      onClick={onClick}
    >
      <ChevronRight className="w-5 h-5 text-white" />
    </div>
  );
}

function PrevArrow({ themeColor, onClick }: ArrowProps) {
  return (
    <div
      className="absolute top-1/2 -left-3 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 cursor-pointer shadow-lg hover:scale-110 transition-transform"
      style={{ backgroundColor: themeColor }}
      onClick={onClick}
    >
      <ChevronLeft className="w-5 h-5 text-white" />
    </div>
  );
}
