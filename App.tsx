import React, { useState, useEffect, useMemo } from 'react';
import { 
  Book, 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Feather, 
  Bookmark, 
  ChevronRight,
  Sparkles,
  Info,
  CalendarDays
} from 'lucide-react';
import { MOCK_BIBLE, PATRISTIC_COMMENTS, loadBibleFromStatic } from './constants';
import { 
  Verse, 
  Highlight, 
  Note, 
  Prayer, 
  ViewState, 
  ReadingProgress 
} from './types';
import Reader from './components/Reader';
import Journal from './components/Journal';
import Dashboard from './components/Dashboard';
import LectioDivina from './components/LectioDivina.tsx';
import About from './components/About';
import LiturgiaDiaria from './components/LiturgiaDiaria';

// --- Global Context for simplicity in this artifact ---
// In a real app, this would be in a separate file.
interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentBookId: string;
  currentChapter: number;
  bible: Book[];
  setCurrentBookId: (id: string) => void;
  setCurrentChapter: (num: number) => void;
  highlights: Highlight[];
  addHighlight: (verseId: string, color: Highlight['color']) => void;
  removeHighlight: (verseId: string) => void;
  prayers: Prayer[];
  addPrayer: (prayer: Prayer) => void;
  deletePrayer: (id: string) => void;
  togglePrayerAnswered: (id: string) => void;
  progress: ReadingProgress;
  view: ViewState;
  setView: (v: ViewState) => void;
}

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  // State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<ViewState>('dashboard');
  const [bible, setBible] = useState<Book[]>(MOCK_BIBLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [verseSearchQuery, setVerseSearchQuery] = useState('');
  
  // Bible Navigation State
  const [currentBookId, setCurrentBookId] = useState('GEN');
  const [currentChapter, setCurrentChapter] = useState(1);
  
  // User Data State (Mocking persistence)
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [progress, setProgress] = useState<ReadingProgress>({ bookId: 'GEN', chapter: 1 });

  // Carrega Bíblia Ave Maria do disco e mantém MOCK_BIBLE como fallback
  useEffect(() => {
    loadBibleFromStatic()
      .then(setBible)
      .catch((err) => console.warn('Falha ao carregar Bíblia Ave Maria, usando mock:', err));
  }, []);

  // Initialize Theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Actions
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addHighlight = (verseId: string, color: Highlight['color']) => {
    setHighlights(prev => {
      const existing = prev.find(h => h.verseId === verseId);
      if (existing) {
        return prev.map(h => h.verseId === verseId ? { ...h, color } : h);
      }
      return [...prev, { verseId, color }];
    });
  };

  const removeHighlight = (verseId: string) => {
    setHighlights(prev => prev.filter(h => h.verseId !== verseId));
  };

  const addPrayer = (prayer: Prayer) => {
    setPrayers(prev => [prayer, ...prev]);
  };

  const deletePrayer = (id: string) => {
    setPrayers(prev => prev.filter(p => p.id !== id));
  };

  const togglePrayerAnswered = (id: string) => {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, isAnswered: !p.isAnswered } : p));
  };

  const contextValue = useMemo(() => ({
    theme, toggleTheme,
    bible,
    currentBookId, currentChapter, setCurrentBookId, setCurrentChapter,
    highlights, addHighlight, removeHighlight,
    prayers, addPrayer, deletePrayer, togglePrayerAnswered,
    progress, view, setView
  }), [theme, bible, currentBookId, currentChapter, highlights, prayers, progress, view]);

  // Helper to find book name
  const currentBook = bible.find(b => b.id === currentBookId);

  const normalizeText = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  type VerseSearchHit = {
    id: string;
    bookId: string;
    bookName: string;
    bookAbbreviation: string;
    chapter: number;
    verse: number;
    text: string;
  };

  const verseIndex: VerseSearchHit[] = useMemo(() => {
    return bible.flatMap(book =>
      book.chapters.flatMap(chapter =>
        chapter.verses.map(verse => ({
          id: verse.id,
          bookId: book.id,
          bookName: book.name,
          bookAbbreviation: book.abbreviation,
          chapter: chapter.number,
          verse: verse.number,
          text: verse.text,
        }))
      )
    );
  }, [bible]);

  const bookResults = useMemo(() => {
    if (!searchQuery.trim()) return bible;
    const term = normalizeText(searchQuery);
    return bible.filter(book => {
      const haystack = `${book.name} ${book.abbreviation}`;
      return normalizeText(haystack).includes(term);
    });
  }, [bible, searchQuery]);

  const verseResults = useMemo(() => {
    const term = normalizeText(verseSearchQuery);
    if (term.length < 3) return [];
    return verseIndex.filter(v => normalizeText(v.text).includes(term)).slice(0, 12);
  }, [verseSearchQuery, verseIndex]);

  const openReaderAt = (bookId: string, chapter: number) => {
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
    setView('reader');
    setSidebarOpen(false);
  };

  const showTopSearch = view === 'reader';

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex h-screen overflow-hidden font-sans">
        
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center gap-3">
              <img
                src="/assets/logos/logo%20navbar.png"
                alt="Logo Acutis"
                className="h-10 w-10 rounded-full object-cover shadow-sm bg-white/60 dark:bg-white/10"
              />
              <span className="font-display font-semibold text-xl tracking-wide text-stone-900 dark:text-stone-100">
                Acutis
              </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <button 
                onClick={() => { setView('dashboard'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-200' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                <Book size={18} />
                <span className="font-medium">Início</span>
              </button>
              
              <button 
                onClick={() => { setView('reader'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'reader' ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-200' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                <Feather size={18} />
                <span className="font-medium">Leitura</span>
              </button>

              <button 
                onClick={() => { setView('journal'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'journal' ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-200' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                <Bookmark size={18} />
                <span className="font-medium">Diário de Oração</span>
              </button>

              <button 
                onClick={() => { setView('lectio'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'lectio' ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-200' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                <Sparkles size={18} />
                <span className="font-medium">Lectio Divina</span>
              </button>

              <button 
                onClick={() => { setView('liturgia'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'liturgia' ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-200' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                <CalendarDays size={18} />
                <span className="font-medium">Liturgia Diária</span>
              </button>

              <button 
                onClick={() => { setView('about'); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${view === 'about' ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-200' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
              >
                <Info size={18} />
                <span className="font-medium">Sobre o Acutis</span>
              </button>

              <div className="pt-5 pb-2 px-3 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  <Search size={14} />
                  <span>Buscar livros</span>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite para filtrar livros"
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-sm text-stone-700 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {searchQuery.trim() ? (
                    bookResults.length ? (
                      bookResults.map(book => (
                        <button
                          key={book.id}
                          onClick={() => openReaderAt(book.id, 1)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${currentBookId === book.id && view === 'reader' ? 'text-gold-700 font-medium bg-gold-50 dark:bg-gold-900/10 dark:text-gold-300' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{book.name}</span>
                            <span className="text-[11px] uppercase text-stone-400 dark:text-stone-500">{book.abbreviation}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 px-1">Nenhum livro encontrado.</p>
                    )
                  ) : (
                    <p className="text-xs text-stone-400 px-1">Digite para filtrar livros.</p>
                  )}
                </div>
              </div>

              <div className="pt-6 pb-2 px-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
                  Livros
                </p>
                <div className="space-y-1">
                  {bible.map(book => (
                    <button
                      key={book.id}
                      onClick={() => openReaderAt(book.id, 1)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${currentBookId === book.id && view === 'reader' ? 'text-gold-700 font-medium bg-gold-50 dark:bg-gold-900/10 dark:text-gold-300' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
                    >
                      {book.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-stone-100 dark:border-stone-800">
               <div className="flex items-center justify-between px-2">
                 <span className="text-xs text-stone-400">Modo Escuro</span>
                 <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full bg-paper-light dark:bg-paper-dark transition-colors relative">
          
          {/* Mobile Header */}
          <header className="lg:hidden h-16 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-4 bg-white dark:bg-stone-900 z-30">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-stone-600 dark:text-stone-300">
              <Menu size={20} />
            </button>
            <h1 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
              {view === 'reader' ? currentBook?.name : view === 'journal' ? 'Diário' : view === 'lectio' ? 'Lectio Divina' : view === 'liturgia' ? 'Liturgia Diária' : view === 'about' ? 'Sobre o Acutis' : 'Acutis'}
            </h1>
            <img
              src="/assets/logos/logo%20navbar%20compact.png"
              alt="Logo Acutis"
              className="h-9 w-9 rounded-full object-cover bg-white/70 dark:bg-white/10"
            />
          </header>

          {showTopSearch && (
            <div className="sticky top-0 z-20 bg-white/85 dark:bg-stone-900/85 backdrop-blur border-b border-stone-200 dark:border-stone-800">
              <div className="max-w-5xl mx-auto px-4 py-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-200 flex items-center justify-center">
                    <Search size={16} />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      value={verseSearchQuery}
                      onChange={(e) => setVerseSearchQuery(e.target.value)}
                      placeholder="Busque por palavras ou trechos (ex: Se o teu olho direito...)"
                      className="w-full pl-4 pr-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  {verseSearchQuery.trim().length < 3 ? (
                    <p className="text-xs text-stone-500 dark:text-stone-400">Digite ao menos 3 letras para buscar versículos.</p>
                  ) : verseResults.length ? (
                    verseResults.map(hit => (
                      <button
                        key={hit.id}
                        onClick={() => openReaderAt(hit.bookId, hit.chapter)}
                        className="w-full text-left px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-gold-300 dark:hover:border-gold-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                          <span className="font-semibold text-stone-800 dark:text-stone-100">{hit.bookName}</span>
                          <span>{hit.bookAbbreviation} {hit.chapter}:{hit.verse}</span>
                        </div>
                        <p className="text-sm text-stone-800 dark:text-stone-200 line-clamp-2">{hit.text}</p>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500 dark:text-stone-400">Nenhum versículo encontrado.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-hidden relative">
            {view === 'dashboard' && <Dashboard />}
            {view === 'reader' && <Reader />}
            {view === 'journal' && <Journal />}
            {view === 'lectio' && <LectioDivina />}
            {view === 'liturgia' && <LiturgiaDiaria />}
            {view === 'about' && <About />}
          </main>

        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;