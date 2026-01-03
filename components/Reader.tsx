import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  MessageCircle, 
  Highlighter, 
  X, 
  Type,
  Maximize2,
  Minimize2,
  BookOpen,
  Download
} from 'lucide-react';
import { AppContext } from '../App';
import { THEME_COLORS, PATRISTIC_COMMENTS } from '../constants';
import { Verse, Book } from '../types';

const Reader: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    bible,
    currentBookId, 
    currentChapter, 
    setCurrentChapter, 
    setCurrentBookId,
    highlights, 
    addHighlight, 
    removeHighlight 
  } = context;

  // Local state
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [showPatristic, setShowPatristic] = useState<string | null>(null); // Verse ID
  const [lectioMode, setLectioMode] = useState(false);
  const [fontSize, setFontSize] = useState(18); // px
  const [showSettings, setShowSettings] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareRef, setShareRef] = useState('');
  const [shareText, setShareText] = useState('');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const currentBook = bible.find(b => b.id === currentBookId);
  const chapterData = currentBook?.chapters.find(c => c.number === currentChapter);

  // Navigation
  const handleNextChapter = () => {
    if (!currentBook) return;
    const maxChapter = currentBook.chapters.length; // Simplified for mock
    
    if (currentChapter < maxChapter) {
      setCurrentChapter(currentChapter + 1);
    } else {
      // Logic to go to next book could go here
      // For now, loop or stop
      const currentBookIndex = bible.findIndex(b => b.id === currentBookId);
      if (currentBookIndex < bible.length - 1) {
        const nextBook = bible[currentBookIndex + 1];
        setCurrentBookId(nextBook.id);
        setCurrentChapter(1);
      }
    }
    scrollToTop();
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else {
        const currentBookIndex = bible.findIndex(b => b.id === currentBookId);
        if (currentBookIndex > 0) {
          const prevBook = bible[currentBookIndex - 1];
            setCurrentBookId(prevBook.id);
            // In a real app we'd find the last chapter of prevBook
            setCurrentChapter(1); 
        }
    }
    scrollToTop();
  };

  const handleChapterSelect = (chapterNumber: number) => {
    setCurrentChapter(chapterNumber);
    scrollToTop();
  };

  const handleHighlight = (color: 'yellow' | 'green' | 'blue' | 'pink') => {
    if (selectedVerseId) {
      addHighlight(selectedVerseId, color);
      setSelectedVerseId(null);
    }
  };

  const loadShareBackground = () => new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = '/share-bg.png'; // coloque o PNG anexado em public/share-bg.png
  });

  const drawOrnament = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#848484';
    ctx.fillStyle = '#848484';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.lineTo(80, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(160, 20);
    ctx.lineTo(230, 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(90, 20);
    ctx.bezierCurveTo(100, 20, 100, 10, 110, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(90, 20);
    ctx.bezierCurveTo(100, 20, 100, 30, 110, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(150, 20);
    ctx.bezierCurveTo(140, 20, 140, 10, 130, 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(150, 20);
    ctx.bezierCurveTo(140, 20, 140, 30, 130, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(120, 6);
    ctx.bezierCurveTo(118, 12, 112, 14, 110, 18);
    ctx.bezierCurveTo(112, 22, 118, 24, 120, 30);
    ctx.bezierCurveTo(122, 24, 128, 22, 130, 18);
    ctx.bezierCurveTo(128, 14, 122, 12, 120, 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  const drawWrapped = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let cursorY = y;
    for (const word of words) {
      const testLine = line + word + ' ';
      const { width: w } = ctx.measureText(testLine);
      if (w > maxWidth) {
        ctx.fillText(line.trim(), x, cursorY);
        line = word + ' ';
        cursorY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) ctx.fillText(line.trim(), x, cursorY);
  };

  const generateShareImage = async (texto: string, referencia: string) => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    try {
      const bg = await loadShareBackground();
      ctx.drawImage(bg, 0, 0, width, height);
    } catch {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#3b2f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    drawOrnament(ctx, width / 2 - 120, 240, 1.0);

    ctx.fillStyle = '#d9d9d9';
    ctx.font = 'italic 40px "Georgia", serif';
    drawWrapped(ctx, `“${texto}”`, 180, 320, width - 360, 60);

    ctx.fillStyle = '#f1f1f1';
    ctx.font = 'italic 38px "Georgia", serif';
    ctx.fillText(referencia, 180, 720);

    drawOrnament(ctx, width / 2 - 120, height - 240, 1.0);

    return canvas.toDataURL('image/png', 1.0);
  };

  const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  const handleShareVerse = async (verse: Verse) => {
    const reference = `${currentBook?.abbreviation || currentBook?.name || 'Livro'} ${currentChapter}, ${verse.number}`;
    const messageRaw = `Olha essa passagem que li no app Sanctus: ${reference} — ${verse.text}\nAcesse o app pelo link: https://sanctus-app.vercel.app/`;
    setShareRef(reference);
    setShareText(verse.text);
    try {
      setShareLoading(true);
      const img = await generateShareImage(verse.text, reference);
      setShareImage(img);

      const supportsWebShare = typeof navigator !== 'undefined' && !!navigator.canShare;
      if (supportsWebShare && img) {
        const file = await dataUrlToFile(img, 'sanctus-compartilhar.png');
        const canShareFile = navigator.canShare && navigator.canShare({ files: [file] });
        if (canShareFile) {
          await navigator.share({ files: [file], text: messageRaw, title: 'Sanctus' });
          return;
        }
      }

      setShareOpen(true);
    } catch (err) {
      setShareOpen(true);
    } finally {
      setShareLoading(false);
    }
  };

  if (!currentBook || !chapterData) {
    return <div className="p-8 text-center text-stone-500">Livro ou capítulo não encontrado.</div>;
  }

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Olha essa passagem que li no app Sanctus: ${shareRef} — ${shareText}\nAcesse o app pelo link: https://sanctus-app.vercel.app/`)}`;

  return (
    <div className={`h-full flex flex-col relative ${lectioMode ? 'z-50 bg-paper-light dark:bg-paper-dark absolute inset-0' : ''}`}>
      
      {/* Reader Toolbar */}
      <div className={`
        flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-20 transition-all duration-300
        ${lectioMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
      `}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
             <button onClick={handlePrevChapter} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
               <ChevronLeft size={20} />
             </button>
             <span className="font-display font-semibold text-stone-800 dark:text-stone-200 min-w-[120px] text-center">
               {currentBook.name} {currentChapter}
             </span>
             <button onClick={handleNextChapter} className="p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
               <ChevronRight size={20} />
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
          >
            <Type size={18} />
          </button>
          <button 
            onClick={() => setLectioMode(!lectioMode)}
            className="p-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            title="Modo Lectio Divina"
          >
            {lectioMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* Font Settings Dropdown */}
        {showSettings && (
          <div className="absolute top-14 right-4 bg-white dark:bg-stone-800 shadow-xl rounded-lg p-4 border border-stone-200 dark:border-stone-700 w-48 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-xs font-semibold text-stone-500 uppercase mb-2">Tamanho do Texto</p>
            <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-900 rounded p-1">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-2 hover:bg-white dark:hover:bg-stone-800 rounded shadow-sm">A-</button>
              <span className="text-sm font-medium">{fontSize}px</span>
              <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-2 hover:bg-white dark:hover:bg-stone-800 rounded shadow-sm">A+</button>
            </div>
          </div>
        )}
      </div>

      {/* Main Text Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 md:py-12 scroll-smooth">
        <div className={`mx-auto transition-all duration-500 ${lectioMode ? 'max-w-5xl' : 'max-w-6xl'}`}>
          <div className="flex gap-8 items-start">
            <div className="flex-1">
          
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-stone-900 dark:text-stone-100 mb-2">
              {currentBook.name}
            </h2>
            <div className="h-1 w-16 bg-gold-500 mx-auto rounded-full opacity-60"></div>
            <p className="font-serif italic text-stone-500 mt-4">Capítulo {currentChapter}</p>
          </div>

          <div className="space-y-4 font-serif leading-relaxed text-stone-800 dark:text-stone-300">
            {chapterData.verses.map((verse) => {
              const highlight = highlights.find(h => h.verseId === verse.id);
              const hasComments = PATRISTIC_COMMENTS[verse.id];
              const isSelected = selectedVerseId === verse.id;

              return (
                <div key={verse.id} className="relative group">
                  <span 
                    onClick={() => setSelectedVerseId(isSelected ? null : verse.id)}
                    style={{ fontSize: `${fontSize}px` }}
                    className={`
                      cursor-pointer transition-colors duration-200 rounded px-1 box-decoration-clone
                      ${highlight ? THEME_COLORS[highlight.color] : 'hover:bg-stone-100 dark:hover:bg-stone-800/50'}
                      ${isSelected ? 'ring-2 ring-gold-400/50 bg-stone-50 dark:bg-stone-800' : ''}
                    `}
                  >
                    <sup className="text-xs font-sans text-stone-400 mr-1 select-none font-medium">{verse.number}</sup>
                    {verse.text}
                  </span>

                  {/* Comment Indicator */}
                  {hasComments && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowPatristic(verse.id); }}
                      className="inline-flex ml-1 align-middle text-gold-600 dark:text-gold-400 opacity-60 hover:opacity-100 transition-opacity"
                      title="Comentário Patrístico disponível"
                    >
                      <BookOpen size={14} />
                    </button>
                  )}
                  
                  {/* Floating Action Menu for Selected Verse */}
                  {isSelected && (
                    <div className="absolute z-10 -top-12 left-0 bg-stone-900 text-white rounded-lg shadow-xl flex items-center p-1.5 gap-1 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex gap-1 pr-2 border-r border-stone-700">
                        <button onClick={() => handleHighlight('yellow')} className="w-5 h-5 rounded-full bg-yellow-400 hover:scale-110 transition-transform" />
                        <button onClick={() => handleHighlight('green')} className="w-5 h-5 rounded-full bg-green-400 hover:scale-110 transition-transform" />
                        <button onClick={() => handleHighlight('blue')} className="w-5 h-5 rounded-full bg-blue-400 hover:scale-110 transition-transform" />
                        <button onClick={() => handleHighlight('pink')} className="w-5 h-5 rounded-full bg-rose-400 hover:scale-110 transition-transform" />
                        <button onClick={() => removeHighlight(verse.id)} className="w-5 h-5 rounded-full bg-white text-stone-900 flex items-center justify-center hover:scale-110 transition-transform"><X size={12} /></button>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleShareVerse(verse); }}
                        className="p-1.5 hover:bg-stone-700 rounded transition-colors" 
                        title="Compartilhar"
                      >
                        <Share2 size={14} />
                      </button>
                      {hasComments && (
                         <button onClick={() => setShowPatristic(verse.id)} className="p-1.5 hover:bg-stone-700 rounded transition-colors" title="Ver Comentários">
                           <MessageCircle size={14} />
                         </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="h-32 flex items-center justify-center gap-8 mt-12 border-t border-stone-100 dark:border-stone-800">
             <button 
              onClick={handlePrevChapter}
              disabled={currentBookId === 'GEN' && currentChapter === 1}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 disabled:opacity-30 transition-colors"
             >
               <ChevronLeft size={18} />
               <span className="font-serif">Anterior</span>
             </button>
             <button 
              onClick={handleNextChapter}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
             >
               <span className="font-serif">Próximo</span>
               <ChevronRight size={18} />
             </button>
          </div>

            </div>

            {/* Chapter Navigation (right rail) */}
            <aside className="hidden lg:block w-44 shrink-0 sticky top-24 self-start bg-white/70 dark:bg-stone-900/70 border border-stone-100 dark:border-stone-800 rounded-xl shadow-sm p-4 space-y-3 backdrop-blur">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Capítulos</p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
                  {currentBook.chapters.map((ch) => (
                    <button
                      key={ch.number}
                      onClick={() => handleChapterSelect(ch.number)}
                      className={`h-9 rounded-lg border text-center transition-colors ${
                        ch.number === currentChapter
                          ? 'bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-900/30 dark:text-gold-200 dark:border-gold-800'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-gold-300 dark:hover:border-gold-600'
                      }`}
                      title={`Ir para capítulo ${ch.number}`}
                    >
                      {ch.number}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Patristic Commentary Modal/Slide-over */}
      {showPatristic && (
        <div className="absolute inset-0 z-30 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowPatristic(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl h-full flex flex-col border-l border-stone-200 dark:border-stone-700 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-gold-50 dark:bg-stone-900">
              <h3 className="font-display font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <BookOpen size={18} className="text-gold-600" />
                Catena Aurea
              </h3>
              <button onClick={() => setShowPatristic(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors dark:text-stone-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg border-l-4 border-gold-400">
                <p className="font-serif text-lg leading-relaxed text-stone-800 dark:text-stone-200 italic mb-2">
                  "{chapterData.verses.find(v => v.id === showPatristic)?.text}"
                </p>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Texto Sagrado</p>
              </div>

              <div className="space-y-6">
                {PATRISTIC_COMMENTS[showPatristic]?.map(comment => (
                  <div key={comment.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200 dark:before:bg-stone-700">
                     <p className="font-serif text-stone-700 dark:text-stone-300 leading-relaxed mb-3 text-sm md:text-base">
                       {comment.text}
                     </p>
                     <div className="flex items-center gap-2">
                       <span className="text-gold-700 dark:text-gold-500 font-display font-semibold text-sm">
                         {comment.author}
                       </span>
                       <span className="w-1 h-1 rounded-full bg-stone-300" />
                       <span className="text-xs text-stone-500 dark:text-stone-500 italic">
                         {comment.work}
                       </span>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-3xl w-full p-4 md:p-6 relative">
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Fechar compartilhamento"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-500 uppercase tracking-wide">
                <Share2 size={14} />
                <span>Compartilhar</span>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 flex justify-center">
                {shareLoading ? (
                  <div className="h-[320px] w-full max-w-[360px] bg-stone-200 dark:bg-stone-700 animate-pulse rounded-lg" />
                ) : shareImage ? (
                  <img src={shareImage} alt="Prévia de compartilhamento" className="max-h-[420px] rounded-lg shadow-md" />
                ) : (
                  <div className="h-[320px] w-full max-w-[360px] bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center text-stone-500">
                    Não foi possível gerar a imagem
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
                >
                  Compartilhar no WhatsApp
                </a>
                {shareImage && (
                  <a
                    href={shareImage}
                    download="sanctus-compartilhar.png"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white font-semibold hover:bg-stone-800"
                  >
                    <Download size={16} />
                    Baixar imagem
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reader;