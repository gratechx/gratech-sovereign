import React, { useState } from 'react';
import { Image, Download, Sparkles, AlertCircle, RefreshCw, Wand2 } from 'lucide-react';
import { Language } from '../types';
import { generateGraTechImage } from '../services/aiService';

interface ImageGenProps {
  lang: Language;
}

const ImageGen: React.FC<ImageGenProps> = ({ lang }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
   
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateGraTechImage(prompt);
      setGeneratedImage(base64Image);
    } catch (err) {
      setError(lang === 'en' ? 'Failed to generate image. Please try again.' : 'فشل توليد الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `gratech-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in min-h-[85vh] flex flex-col">
       <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gratech-primary/10 border border-gratech-primary/20 text-gratech-primary text-xs font-bold mb-4">
             <Wand2 size={12} />
             {lang === 'en' ? 'GRA-TECH VISION' : 'محرك غراتك البصري'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
             {lang === 'en' ? 'Visualize Your Ideas' : 'حول أفكارك إلى صور'}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
             {lang === 'en'
               ? 'Powered by GraTech Sovereign AI. Create stunning visuals in seconds.'
               : 'مدعوم بتقنية GraTech Sovereign AI. أنشئ صوراً مذهلة في ثوانٍ.'}
          </p>
       </div>

       {/* Main Workspace */}
       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Controls */}
         <div className="lg:col-span-1 space-y-6">
             <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                   {lang === 'en' ? 'Describe your imagination' : 'وصف خيالك'}
                </label>
                <textarea
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder={lang === 'en' ? "A futuristic Saudi city on Mars..." : "مدينة سعودية مستقبلية على كوكب المريخ..."}
                   className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-gratech-primary/50 transition-all input-square-glow"
                />
               
                <button
                   onClick={handleGenerate}
                   disabled={isLoading || !prompt.trim()}
                   className={`w-full mt-4 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary ${
                     isLoading || !prompt.trim()
                       ? 'bg-white/5 text-zinc-600 cursor-not-allowed'
                       : 'bg-white text-black hover:bg-gratech-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02]'
                   }`}
                >
                   {isLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                   {isLoading ? (lang === 'en' ? 'Dreaming...' : 'جاري التخيل...') : (lang === 'en' ? 'Generate' : 'توليد')}
                </button>
             </div>

             <div className="bg-gratech-primary/5 rounded-2xl p-6 border border-gratech-primary/10">
                <h3 className="text-gratech-primary font-bold mb-2 flex items-center gap-2">
                   <AlertCircle size={16} />
                   {lang === 'en' ? 'Pro Tips' : 'نصائح احترافية'}
                </h3>
                <ul className="text-sm text-gratech-primary/60 space-y-2 list-disc list-inside">
                   <li>{lang === 'en' ? 'Be specific about lighting (e.g., "cinematic lighting")' : 'كن محدداً بشأن الإضاءة (مثلاً "إضاءة سينمائية")'}</li>
                   <li>{lang === 'en' ? 'Mention style (e.g., "cyberpunk", "oil painting")' : 'اذكر النمط (مثلاً "سايبربانك"، "لوحة زيتية")'}</li>
                   <li>{lang === 'en' ? 'Keep it under 30 words for best results' : 'يفضل أن يكون الوصف أقل من 30 كلمة'}</li>
                </ul>
             </div>
         </div>

         {/* Canvas */}
         <div className="lg:col-span-2 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden min-h-[400px]">
             {/* Background Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             
             {generatedImage ? (
                <div className="relative group w-full h-full flex items-center justify-center p-4">
                   <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-w-full max-h-[600px] rounded-lg shadow-2xl animate-fade-in"
                   />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-3xl m-4">
                      <button
                          onClick={handleDownload}
                          className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-gratech-primary"
                      >
                          <Download size={20} />
                          {lang === 'en' ? 'Download HD' : 'تحميل بجودة عالية'}
                      </button>
                   </div>
                </div>
             ) : (
                <div className="text-center z-10 opacity-50">
                   {isLoading ? (
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-16 h-16 border-4 border-gratech-primary border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-gratech-primary animate-pulse">{lang === 'en' ? 'Rendering pixels...' : 'جاري معالجة البكسلات...'}</p>
                      </div>
                   ) : (
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <Image size={40} className="text-zinc-600" />
                         </div>
                         <p className="text-zinc-600">
                            {error ? <span className="text-red-400">{error}</span> : (lang === 'en' ? 'Your masterpiece will appear here' : 'ستظهر تحفتك الفنية هنا')}
                         </p>
                      </div>
                   )}
                </div>
             )}
         </div>
       </div>
    </div>
  );
};

export default ImageGen;