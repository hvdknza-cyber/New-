
import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Youtube, 
  Music2, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  Info,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { analyzeVideoLink } from './geminiService';
import { VideoMetadata, AppStatus, DownloadState, QualityOption } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>({
    optionId: null,
    progress: 0,
    statusText: ''
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setMetadata(null);

    try {
      const result = await analyzeVideoLink(url);
      setMetadata(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError("تعذر تحليل الرابط. تأكد من أن الرابط صحيح ومنصة الفيديو مدعومة.");
      setStatus(AppStatus.ERROR);
    }
  };

  const startDownload = async (option: QualityOption) => {
    setDownloadState({ optionId: option.id, progress: 0, statusText: 'جاري الاتصال بالخادم...' });
    
    const steps = [
      { p: 15, t: 'جاري استخراج رابط الميديا...' },
      { p: 40, t: option.isWatermarkFree ? 'جاري إزالة العلامة المائية...' : 'جاري تجهيز الملف...' },
      { p: 70, t: 'جاري تحويل التنسيق والضغط...' },
      { p: 90, t: 'جاري تجميع أجزاء الملف...' },
      { p: 100, t: 'اكتمل التجهيز! جاري بدء التحميل...' }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
      setDownloadState(prev => ({ ...prev, progress: step.p, statusText: step.t }));
    }

    // Trigger a mock file download
    const blob = new Blob(["Mock video content"], { type: "video/mp4" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${metadata?.title || 'video'}_${option.label}.mp4`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadState({ optionId: null, progress: 0, statusText: '' });
    }, 2000);
  };

  const reset = () => {
    setUrl('');
    setMetadata(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-['Noto_Kufi_Arabic']">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Download size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SnapSave <span className="text-blue-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <button onClick={reset} className="hover:text-white transition-colors">الرئيسية</button>
            <a href="https://tiktok.com" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">تيك توك <ExternalLink size={12}/></a>
            <a href="https://youtube.com" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">يوتيوب <ExternalLink size={12}/></a>
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full text-xs font-bold transition-all border border-zinc-700">
            نسخة Pro (قريباً)
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text leading-tight">
            أداة تحميل الفيديوهات الذكية
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            حمل من TikTok و YouTube بأعلى جودة وبضغطة زر واحدة. بدون إعلانات مزعجة وبدون علامات مائية.
          </p>
        </div>

        {/* Search Input Area */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-60`}></div>
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="الصق رابط الفيديو هنا..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-zinc-600 text-left dir-ltr"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={24} />
              </div>
              <button 
                disabled={status === AppStatus.LOADING || !url}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 min-w-[160px] shadow-xl shadow-blue-600/20"
              >
                {status === AppStatus.LOADING ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Zap size={20} />
                    <span>تحليل الرابط</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Supported Platforms */}
          <div className="flex justify-center gap-8 mt-8 opacity-60">
            <div className="flex items-center gap-2 hover:opacity-100 transition-opacity"><Youtube className="text-red-500" size={20}/> <span className="text-sm font-medium">YouTube</span></div>
            <div className="flex items-center gap-2 hover:opacity-100 transition-opacity"><Music2 className="text-white" size={20}/> <span className="text-sm font-medium">TikTok</span></div>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-w-4xl mx-auto">
          {status === AppStatus.ERROR && (
            <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex items-center gap-4 text-red-400 animate-in fade-in zoom-in-95">
              <AlertCircle size={28} />
              <div>
                <h4 className="font-bold">حدث خطأ ما</h4>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
          )}

          {status === AppStatus.SUCCESS && metadata && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Preview Card */}
              <div className="glass rounded-2xl overflow-hidden p-4 group">
                <div className="aspect-video relative rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={metadata.thumbnail} 
                    alt={metadata.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                    {metadata.duration}
                  </div>
                </div>
                <div className="mt-5 px-1">
                  <h3 className="font-bold text-xl line-clamp-2 mb-2 leading-snug">{metadata.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-zinc-500 text-sm">
                      بواسطة: <span className="text-blue-400 font-medium">{metadata.author}</span>
                    </p>
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded uppercase tracking-widest border border-zinc-700">
                      {metadata.platform}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Options Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Download className="text-blue-500" size={24} />
                    جاهز للتحميل
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {metadata.qualityOptions.map((option) => {
                    const isDownloading = downloadState.optionId === option.id;
                    return (
                      <div 
                        key={option.id}
                        className={`glass border-zinc-700/50 p-4 rounded-xl transition-all relative overflow-hidden ${isDownloading ? 'ring-2 ring-blue-500' : 'hover:bg-zinc-800/40'}`}
                      >
                        {isDownloading && (
                          <div 
                            className="absolute bottom-0 right-0 h-1 bg-blue-500 transition-all duration-300" 
                            style={{ width: `${downloadState.progress}%` }}
                          />
                        )}
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${option.isWatermarkFree ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                              {option.format === 'MP3' ? <Music2 size={20}/> : <Smartphone size={20}/>}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-zinc-100">{option.label}</span>
                                {option.isWatermarkFree && (
                                  <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase border border-green-500/30">
                                    No Watermark
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-zinc-500 font-medium uppercase">{option.format} • {option.size}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => startDownload(option)}
                            disabled={!!downloadState.optionId}
                            className={`min-w-[100px] h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                              isDownloading 
                                ? 'bg-zinc-800 text-zinc-400 cursor-default' 
                                : 'bg-white text-black hover:bg-blue-500 hover:text-white shadow-lg'
                            }`}
                          >
                            {isDownloading ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <>
                                <Download size={16} />
                                تحميل
                              </>
                            )}
                          </button>
                        </div>
                        
                        {isDownloading && (
                          <div className="mt-3 text-[11px] text-blue-400 font-medium animate-pulse flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            {downloadState.statusText}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {downloadState.progress === 100 && (
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl flex items-center gap-3 text-green-400 animate-bounce mt-4">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold">بدأ التحميل بنجاح! تفقد مجلد التنزيلات.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Grid */}
        {status === AppStatus.IDLE && (
          <div className="grid md:grid-cols-3 gap-6 mt-16 animate-in fade-in slide-in-from-top-4 duration-1000">
            <InfoBox 
              icon={<ShieldCheck className="text-blue-500" size={28} />}
              title="أمان فائق"
              desc="روابطنا مباشرة وآمنة 100%، نقوم بفحص كافة الملفات قبل إتاحة التحميل."
            />
            <InfoBox 
              icon={<Zap className="text-yellow-500" size={28} />}
              title="لا حدود"
              desc="حمل عدد غير محدود من الفيديوهات يومياً بدون أي قيود أو اشتراكات مدفوعة."
            />
            <InfoBox 
              icon={<Smartphone className="text-purple-500" size={28} />}
              title="دقة عالية"
              desc="ندعم كافة الجودات المتاحة من المصدر بما فيها 4K و Full HD للتحميل المباشر."
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 bg-zinc-950/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Download size={18} className="text-blue-500" />
              <span className="font-bold text-zinc-300 uppercase tracking-tighter">SnapSave Pro</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-xs">أفضل منصة عربية لتحميل ميديا التواصل الاجتماعي بأمان وسرعة.</p>
          </div>
          <div className="flex gap-8 text-sm text-zinc-500 font-medium">
            <button className="hover:text-blue-400 transition-colors">سياسة الاستخدام</button>
            <button className="hover:text-blue-400 transition-colors">عن الموقع</button>
            <button className="hover:text-blue-400 transition-colors">أرسل اقتراحك</button>
          </div>
          <div className="text-zinc-600 text-[10px] text-center md:text-left">
            جميع الحقوق محفوظة © 2024<br/>SnapSave Video Downloader Engine
          </div>
        </div>
      </footer>
    </div>
  );
};

const InfoBox: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="glass p-8 rounded-3xl hover:border-blue-500/30 transition-all group hover:-translate-y-1">
    <div className="mb-5 p-4 bg-zinc-900 w-fit rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="font-bold text-xl mb-3">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default App;
