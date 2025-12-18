
import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { analyzeVideoLink } from './services/geminiService';
import { VideoMetadata, AppStatus } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      console.error(err);
      setError("تعذر تحليل الرابط. تأكد من أن الرابط صحيح ومنصة الفيديو مدعومة.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setUrl('');
    setMetadata(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Download size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SnapSave <span className="text-blue-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">يوتيوب</a>
            <a href="#" className="hover:text-white transition-colors">تيك توك</a>
            <a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a>
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full text-xs font-bold transition-all border border-zinc-700">
            نسخة المتصفح
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            حمل فيديوهاتك المفضلة مجاناً
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            أداة احترافية لتحميل الفيديوهات من يوتيوب وتيك توك بجودة عالية (4K/HD) وبدون أي علامات مائية.
          </p>
        </div>

        {/* Search Input Area */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-focus-within:opacity-75`}></div>
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ضع رابط الفيديو هنا (يوتيوب أو تيك توك)..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={24} />
              </div>
              <button 
                disabled={status === AppStatus.LOADING || !url}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 min-w-[160px]"
              >
                {status === AppStatus.LOADING ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Download size={20} />
                    <span>بدء التحليل</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Supported Platforms */}
          <div className="flex justify-center gap-6 mt-6 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
            <div className="flex items-center gap-2"><Youtube className="text-red-500" size={20}/> <span className="text-xs">YouTube</span></div>
            <div className="flex items-center gap-2"><Music2 className="text-white" size={20}/> <span className="text-xs">TikTok</span></div>
            <div className="flex items-center gap-2 text-zinc-400"><Info size={16}/> <span className="text-xs">المزيد قريباً</span></div>
          </div>
        </div>

        {/* Results / Error / Loading States */}
        <div className="max-w-4xl mx-auto">
          {status === AppStatus.ERROR && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {status === AppStatus.SUCCESS && metadata && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Video Preview */}
              <div className="glass rounded-2xl overflow-hidden p-3 group">
                <div className="aspect-video relative rounded-xl overflow-hidden">
                  <img 
                    src={metadata.thumbnail} 
                    alt={metadata.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="text-white" size={48} />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-mono">
                    {metadata.duration}
                  </div>
                </div>
                <div className="mt-4 px-2">
                  <h3 className="font-bold text-lg line-clamp-2 mb-1">{metadata.title}</h3>
                  <p className="text-zinc-500 text-sm flex items-center gap-1">
                    بواسطة: <span className="text-zinc-300 font-medium">{metadata.author}</span>
                  </p>
                </div>
              </div>

              {/* Download Options */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Download className="text-blue-500" size={20} />
                  خيارات التحميل
                </h3>
                <div className="space-y-3">
                  {metadata.qualityOptions.map((option, idx) => (
                    <div 
                      key={idx}
                      className="glass hover:bg-zinc-800/50 border-zinc-700/50 p-4 rounded-xl flex items-center justify-between group cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${option.isWatermarkFree ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {option.format === 'MP3' ? <Music2 size={18}/> : <Smartphone size={18}/>}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{option.label}</span>
                            {option.isWatermarkFree && (
                              <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                بدون علامة مائية
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-500 uppercase">{option.format} • {option.size}</span>
                        </div>
                      </div>
                      <button className="bg-zinc-800 group-hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                        <Download size={14} />
                        تحميل
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 text-center italic">
                  * قد تختلف أحجام الملفات الفعلية قليلاً بناءً على معالجة الخادم.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        {status === AppStatus.IDLE && (
          <div className="grid md:grid-cols-3 gap-8 mt-12 animate-in fade-in zoom-in-95 duration-700">
            <FeatureCard 
              icon={<ShieldCheck className="text-green-500" size={24} />}
              title="آمن تماماً"
              description="نحن لا نقوم بتخزين أي من بياناتك أو فيديوهاتك على خوادمنا. الخصوصية هي أولويتنا."
            />
            <FeatureCard 
              icon={<Zap className="text-yellow-500" size={24} />}
              title="سرعة فائقة"
              description="معالجة روابط الفيديوهات والتحميل تتم في ثوانٍ معدودة وبأعلى جودة متاحة."
            />
            <FeatureCard 
              icon={<Smartphone className="text-purple-500" size={24} />}
              title="دعم كافة المنصات"
              description="واجهة متجاوبة تعمل بشكل مثالي على الهواتف الذكية والحواسيب اللوحية."
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 bg-zinc-950/30">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-zinc-800 rounded">
              <Download size={16} className="text-zinc-400" />
            </div>
            <span className="font-bold text-sm text-zinc-400">SnapSave Pro © 2024</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300">الشروط والأحكام</a>
            <a href="#" className="hover:text-zinc-300">سياسة الخصوصية</a>
            <a href="#" className="hover:text-zinc-300">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="glass p-6 rounded-2xl hover:border-zinc-500/50 transition-colors">
    <div className="mb-4">{icon}</div>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default App;
