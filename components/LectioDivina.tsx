import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Brain,
  HandHeart,
  Flame,
  Footprints,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Timer,
  Lock,
  Unlock,
  Music4,
  BookMarked,
  Star,
  X
} from 'lucide-react';
import { AppContext } from '../App';
import { Chapter, Verse } from '../types';

// Minimal local storage keys for persistence
const STORAGE_KEY = 'lectio-draft-v1';
const HISTORY_KEY = 'lectio-history-v1';

type StepKey = 'lectio' | 'meditatio' | 'oratio' | 'contemplatio' | 'actio';

interface DraftState {
  step: StepKey;
  includeActio: boolean;
  contemplatioDuration: number;
  passage: {
    bookId: string;
    chapter: number;
  };
  meditatio: Record<string, string>;
  oratio: {
    text: string;
    isPrivate: boolean;
  };
  actio: {
    commitment: string;
    reminder: boolean;
    done: boolean;
  };
}

interface HistoryEntry {
  id: string;
  date: string;
  passage: string;
  bookId: string;
  chapter: number;
  lectioSeconds: number;
  contemplatioSeconds: number;
  oratio: string;
  meditatio: { question: string; answer: string }[];
  actio: DraftState['actio'];
}

const medQuestions = [
  'Qual palavra ou frase mais tocou seu coração?',
  'O que Deus está dizendo a você através deste texto?',
  'Que emoções ou memórias este texto desperta?',
  'Como este texto se conecta com sua vida atual?',
  'O que este texto revela sobre Deus? Sobre você?',
  'Existe alguma resistência ou desconforto em você ao ler isto?',
];

const stepOrder: StepKey[] = ['lectio', 'meditatio', 'oratio', 'contemplatio', 'actio'];

const LectioDivina: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { bible, currentBookId, currentChapter, setCurrentBookId, setCurrentChapter } = context;

  const createInitialDraft = (): DraftState => ({
    step: 'lectio',
    includeActio: true,
    contemplatioDuration: 5,
    passage: { bookId: currentBookId, chapter: currentChapter },
    meditatio: {},
    oratio: { text: '', isPrivate: true },
    actio: { commitment: '', reminder: false, done: false },
  });

  const [draft, setDraft] = useState<DraftState>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        return JSON.parse(saved) as DraftState;
      } catch (err) {
        console.warn('Erro ao restaurar draft Lectio:', err);
      }
    }
    return createInitialDraft();
  });

  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryEntry | null>(null);

  // Persist draft
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  // Load history on mount
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(HISTORY_KEY) : null;
    if (raw) {
      try {
        setHistory(JSON.parse(raw) as HistoryEntry[]);
      } catch (err) {
        console.warn('Erro ao ler histórico de Lectio:', err);
      }
    }
  }, []);

  const selectedBook = useMemo(() => bible.find(b => b.id === draft.passage.bookId), [bible, draft.passage.bookId]);
  const selectedChapter: Chapter | undefined = selectedBook?.chapters.find(c => c.number === draft.passage.chapter);

  // Build a concise passage preview
  const passageVerses: Verse[] = useMemo(() => selectedChapter?.verses || [], [selectedChapter]);
  const passageRef = selectedBook ? `${selectedBook.name} ${draft.passage.chapter}` : 'Selecionar texto';

  // Timers
  const [lectioSeconds, setLectioSeconds] = useState(0);
  const [lectioRunning, setLectioRunning] = useState(true);
  const [contemplatioSeconds, setContemplatioSeconds] = useState(0);
  const [contemplatioRunning, setContemplatioRunning] = useState(false);

  const canAdvanceFromLectio = lectioSeconds >= 60;
  const contemplatioTarget = draft.contemplatioDuration * 60;
  const contemplatioDone = contemplatioSeconds >= contemplatioTarget;
  const contemplatioRemaining = Math.max(contemplatioTarget - contemplatioSeconds, 0);

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

  const formatSeconds = (total: number) => {
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = Math.floor(total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // reset timers when step changes
  useEffect(() => {
    if (draft.step === 'lectio') {
      setLectioSeconds(0);
      setLectioRunning(true);
    } else {
      setLectioRunning(false);
    }
    if (draft.step === 'contemplatio') {
      setContemplatioSeconds(0);
      setContemplatioRunning(true);
    } else {
      setContemplatioRunning(false);
    }
  }, [draft.step]);

  // ticking timers
  useEffect(() => {
    const id = setInterval(() => {
      setLectioSeconds(prev => (lectioRunning ? prev + 1 : prev));
      setContemplatioSeconds(prev => {
        if (!contemplatioRunning) return prev;
        const next = prev + 1;
        if (next >= contemplatioTarget) {
          setContemplatioRunning(false);
          return contemplatioTarget;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [lectioRunning, contemplatioRunning, contemplatioTarget]);

  const visibleSteps = draft.includeActio ? stepOrder : stepOrder.filter(s => s !== 'actio');

  const goToStep = (step: StepKey) => {
    if (!draft.includeActio && step === 'actio') return;
    setFinished(false);
    setSaved(false);
    setDraft(prev => ({ ...prev, step }));
  };

  const goNext = () => {
    const idx = visibleSteps.findIndex(s => s === draft.step);
    const next = visibleSteps[idx + 1];
    if (next) {
      setFinished(false);
      setSaved(false);
      setDraft(prev => ({ ...prev, step: next }));
    } else {
      setFinished(true);
    }
  };

  const goPrev = () => {
    const idx = visibleSteps.findIndex(s => s === draft.step);
    const prev = visibleSteps[idx - 1];
    if (prev) {
      setFinished(false);
      setSaved(false);
      setDraft(p => ({ ...p, step: prev }));
    }
  };

  const updatePassage = (bookId: string, chapter: number) => {
    setDraft(prev => ({ ...prev, passage: { bookId, chapter } }));
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
  };

  const handleStart = () => {
    setStarted(true);
    setFinished(false);
    setSaved(false);
    setDraft(createInitialDraft());
    setLectioSeconds(0);
    setContemplatioSeconds(0);
    setContemplatioRunning(false);
  };

  const renderProgress = () => {
    const items = visibleSteps;
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((s, idx) => {
          const icons: Record<StepKey, JSX.Element> = {
            lectio: <BookOpen size={14} />,
            meditatio: <Brain size={14} />,
            oratio: <HandHeart size={14} />,
            contemplatio: <Flame size={14} />,
            actio: <Footprints size={14} />,
          };
          const active = draft.step === s;
          const done = idx < items.indexOf(draft.step);
          return (
            <button
              key={s}
              onClick={() => goToStep(s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${active ? 'bg-amber-100/80 border-amber-300 text-amber-800 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-100' : done ? 'bg-stone-100 border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200' : 'bg-white border-stone-200 text-stone-500 dark:bg-stone-900 dark:border-stone-800 dark:text-stone-400'}`}
            >
              {icons[s]}
              <span className="capitalize">{s}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderPassageHeader = () => (
    <div className="rounded-2xl border border-amber-200/70 dark:border-indigo-800 bg-amber-50/60 dark:bg-indigo-900/30 p-4 space-y-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200 font-semibold">Texto escolhido</p>
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">{passageRef}</h2>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm"
            value={draft.passage.bookId}
            onChange={(e) => updatePassage(e.target.value, 1)}
          >
            {bible.map(book => (
              <option key={book.id} value={book.id}>{book.name}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-sm"
            value={draft.passage.chapter}
            onChange={(e) => updatePassage(draft.passage.bookId, Number(e.target.value))}
          >
            {selectedBook?.chapters.map(ch => (
              <option key={ch.number} value={ch.number}>Cap. {ch.number}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
        {passageVerses.slice(0, 25).map(v => (
          <p key={v.id} className="text-sm leading-7 text-stone-800 dark:text-stone-100">
            <span className="text-amber-700 dark:text-indigo-200 mr-2 font-semibold">{v.number}</span>
            {v.text}
          </p>
        ))}
        {passageVerses.length > 25 && (
          <p className="text-xs text-stone-500 dark:text-stone-400">Mostrando primeiros 25 versos deste capítulo.</p>
        )}
      </div>
    </div>
  );

  const renderLectio = () => (
    <div className="space-y-4">
      {renderPassageHeader()}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center dark:bg-indigo-900/50 dark:text-indigo-100">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Lectio</p>
            <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Leia devagar, duas ou três vezes.</h3>
          </div>
        </div>
        <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">
          Leia o texto devagar, saboreando cada palavra. Permita que a Palavra penetre seu coração. Leia 2-3 vezes.
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
          <Music4 size={16} />
          <span className="font-medium">▶ Ouvir texto</span>
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-amber-700 dark:text-indigo-200">
          <Timer size={16} />
          <span>Tempo de leitura: {lectioSeconds}s</span>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="text-xs text-stone-500">O botão de continuar aparece após 60s.</div>
          <button
            disabled={!canAdvanceFromLectio}
            onClick={goNext}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${canAdvanceFromLectio ? 'bg-amber-600 text-white hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600' : 'bg-stone-200 text-stone-500 cursor-not-allowed'}`}
          >
            Continuar para Meditatio
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMeditatio = () => (
    <div className="space-y-4">
      {renderPassageHeader()}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center dark:bg-indigo-900/50 dark:text-indigo-100">
            <Brain size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Meditatio</p>
            <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Deixe o texto falar ao seu coração.</h3>
          </div>
        </div>
        <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">
          Reflita sobre o significado do texto. Use as perguntas como guias, responda as que desejar. Salvamos automaticamente.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {medQuestions.map(q => (
            <div key={q} className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 p-4 space-y-3">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 leading-snug">{q}</p>
              <textarea
                value={draft.meditatio[q] || ''}
                onChange={(e) => setDraft(prev => ({ ...prev, meditatio: { ...prev.meditatio, [q]: e.target.value } }))}
                placeholder="Escreva livremente..."
                className="w-full min-h-[120px] rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3 py-2 text-sm text-stone-800 dark:text-stone-100"
              />
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Autosave ativo</span>
                <span>✎ salvo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={goPrev} className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200">Voltar</button>
        <button onClick={goNext} className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2">
          Continuar para Oratio
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderOratio = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white dark:from-indigo-950 dark:to-stone-900 border border-amber-100 dark:border-indigo-900 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center dark:bg-indigo-900/50 dark:text-indigo-100">
            <HandHeart size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Oratio</p>
            <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Converse com Deus, pessoalmente.</h3>
          </div>
        </div>
        <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">
          Agora, fale com Deus sobre o que meditou. Seja honesto, aberto e pessoal. Esta é sua conversa íntima com o Criador.
        </p>
        <textarea
          value={draft.oratio.text}
          onChange={(e) => setDraft(prev => ({ ...prev, oratio: { ...prev.oratio, text: e.target.value } }))}
          placeholder="Senhor, ao meditar em Tua Palavra..."
          className="mt-4 w-full min-h-[180px] rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3 py-3 text-sm text-stone-800 dark:text-stone-100"
        />
        <div className="mt-3 flex items-center gap-3 text-sm text-stone-600 dark:text-stone-400">
          <button
            onClick={() => setDraft(prev => ({ ...prev, oratio: { ...prev.oratio, isPrivate: !prev.oratio.isPrivate } }))}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200"
          >
            {draft.oratio.isPrivate ? <Lock size={16} /> : <Unlock size={16} />}
            {draft.oratio.isPrivate ? 'Privado' : 'Compartilhar (futuro)'}
          </button>
          <span className="text-xs text-stone-500">Sugestões dos santos virão aqui.</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={goPrev} className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200">Voltar</button>
        <button onClick={goNext} className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2">
          Continuar para Contemplatio
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderContemplatio = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-indigo-900 to-stone-950 text-indigo-100 border border-indigo-800 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 text-indigo-100 flex items-center justify-center">
            <Flame size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200/80">Contemplatio</p>
            <h3 className="font-display text-xl">Descanse em silêncio na presença de Deus.</h3>
          </div>
        </div>
        <p className="mt-4 text-indigo-100/90 leading-relaxed">
          Descanse em silêncio. Não há nada a fazer, apenas estar na presença amorosa de Deus. Permita-se ser amado.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10">
            <Timer size={16} />
            <span>Restam {formatSeconds(contemplatioRemaining)} / {formatSeconds(contemplatioTarget)}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10">
            <span>Alvo: </span>
            {[3,5,10,15].map(min => (
              <button
                key={min}
                onClick={() => setDraft(prev => ({ ...prev, contemplatioDuration: min }))}
                className={`px-2 py-1 rounded-full text-xs ${draft.contemplatioDuration === min ? 'bg-amber-400 text-stone-900' : 'bg-white/10 text-indigo-100'}`}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setContemplatioRunning(r => !r)}
            className="px-4 py-2 rounded-full bg-white/15 text-indigo-50 flex items-center gap-2 hover:bg-white/25"
          >
            {contemplatioRunning ? <Pause size={16} /> : <Play size={16} />}
            {contemplatioRunning ? 'Pausar' : 'Iniciar'} silêncio
          </button>
          <div className="text-sm text-indigo-100/80">Modo Tela Limpa: silencioso, com ícone pulsante.</div>
        </div>
        {contemplatioDone && (
          <div className="mt-4 rounded-lg bg-amber-200/20 border border-amber-300/50 text-amber-100 px-4 py-3">
            Sino suave: "Que a paz de Cristo habite em você."
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <button onClick={goPrev} className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200">Voltar</button>
        {draft.includeActio ? (
          <button onClick={goNext} className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2">
            Continuar para Actio
            <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={goNext} className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2">
            Finalizar
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );

  const renderActio = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center dark:bg-indigo-900/50 dark:text-indigo-100">
            <Footprints size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Actio</p>
            <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Transforme em ação concreta.</h3>
          </div>
        </div>
        <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">
          Como você viverá esta Palavra hoje? Que ação concreta Deus está te convidando a realizar?
        </p>
        <input
          value={draft.actio.commitment}
          onChange={(e) => setDraft(prev => ({ ...prev, actio: { ...prev.actio, commitment: e.target.value } }))}
          placeholder="Ex: Telefonar para reconciliar-me com meu irmão ainda hoje."
          maxLength={200}
          className="mt-4 w-full rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-3 py-2 text-sm text-stone-800 dark:text-stone-100"
        />
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-600 dark:text-stone-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.actio.reminder}
              onChange={(e) => setDraft(prev => ({ ...prev, actio: { ...prev.actio, reminder: e.target.checked } }))}
            />
            Adicionar lembrete
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.actio.done}
              onChange={(e) => setDraft(prev => ({ ...prev, actio: { ...prev.actio, done: e.target.checked } }))}
            />
            Marcar como concluído
          </label>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={goPrev} className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200">Voltar</button>
        <button onClick={goNext} className="px-4 py-2 rounded-full text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center gap-2">
          Finalizar Lectio
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const saveToHistory = () => {
    const historyRaw = window.localStorage.getItem(HISTORY_KEY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    const medResponses = medQuestions
      .map(q => ({ question: q, answer: draft.meditatio[q] || '' }))
      .filter(item => item.answer.trim().length);
    const summary = {
      id: `lectio_${Date.now()}`,
      date: new Date().toISOString(),
      passage: passageRef,
      bookId: draft.passage.bookId,
      chapter: draft.passage.chapter,
      lectioSeconds,
      contemplatioSeconds,
      oratio: draft.oratio.text,
      meditatio: medResponses,
      actio: draft.actio,
    };
    const updated = [summary, ...history].slice(0, 50);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
    setSaved(true);
  };

  const discardSession = () => {
    setDraft(createInitialDraft());
    setFinished(false);
    setSaved(false);
    setLectioSeconds(0);
    setContemplatioSeconds(0);
    setContemplatioRunning(false);
  };

  const renderCompletion = () => (
    <div className="space-y-4">
      <div className="rounded-2xl bg-amber-50 dark:bg-indigo-950 border border-amber-200 dark:border-indigo-900 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center dark:bg-indigo-800 dark:text-indigo-100">
            <Star size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200">Lectio concluída</p>
            <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Que a Palavra permaneça em você e dê frutos.</h3>
          </div>
        </div>
        <p className="mt-3 text-sm text-stone-700 dark:text-stone-200">Texto: {passageRef}</p>
        <p className="text-sm text-stone-700 dark:text-stone-200">Tempo aproximado: {(lectioSeconds + contemplatioSeconds) || 0}s + meditações e oração.</p>
        {saved && <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">Sessão salva em "Lectio anteriores".</p>}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            onClick={saveToHistory}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-100 hover:border-amber-300 dark:hover:border-indigo-600"
          >
            <BookMarked size={16} />
            Salvar nas sessões de Lectio
          </button>
          <button
            onClick={discardSession}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-100 hover:border-rose-300 dark:hover:border-rose-600"
          >
            <Sparkles size={16} />
            Descartar sessão
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 shadow-sm flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
        <input
          type="checkbox"
          checked={draft.includeActio}
          onChange={(e) => setDraft(prev => ({ ...prev, includeActio: e.target.checked }))}
        />
        Incluir etapa Actio
      </div>
      <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
        <Timer size={16} />
        Contemplatio padrão:
        <select
          className="px-2 py-1 rounded bg-stone-100 dark:bg-stone-800"
          value={draft.contemplatioDuration}
          onChange={(e) => setDraft(prev => ({ ...prev, contemplatioDuration: Number(e.target.value) }))}
        >
          {[3,5,10,15].map(min => <option key={min} value={min}>{min} min</option>)}
        </select>
      </div>
      <div className="text-xs text-stone-500 dark:text-stone-400">Estado é salvo automaticamente.</div>
    </div>
  );

  const renderIntro = () => (
    <div className="rounded-3xl bg-gradient-to-br from-amber-100 via-white to-amber-50 dark:from-indigo-950 dark:via-stone-900 dark:to-indigo-900 border border-amber-200/70 dark:border-indigo-900 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center dark:bg-indigo-800 dark:text-indigo-100">
          <Sparkles size={22} />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200 font-semibold">Lectio Divina</p>
          <h1 className="font-display text-2xl text-stone-900 dark:text-stone-50">Leitura Orante das Escrituras</h1>
          <p className="text-stone-700 dark:text-stone-200 leading-relaxed max-w-3xl">
            Uma jornada contemplativa em quatro passos clássicos (e Actio opcional), guiando você a um encontro pessoal com a Palavra de Deus. Salva automaticamente e pode ser retomada.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowGuideModal(true)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-stone-900 border border-amber-200 dark:border-indigo-800 text-sm text-stone-800 dark:text-stone-100 hover:border-amber-400 dark:hover:border-indigo-600"
            >
              O que é a Lectio? Por que e como fazer?
            </button>
            {!started && (
              <button
                onClick={handleStart}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Começar Lectio Divina
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-200 dark:bg-stone-800 dark:border-indigo-800">Sugestão do dia</span>
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-200 dark:bg-stone-800 dark:border-indigo-800">Evangelho do domingo</span>
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-200 dark:bg-stone-800 dark:border-indigo-800">Escolher manualmente</span>
            <span className="px-3 py-1 rounded-full bg-white/80 border border-amber-200 dark:bg-stone-800 dark:border-indigo-800">Retomar última Lectio</span>
          </div>
        </div>
      </div>
    </div>
  );

  const mainContent = () => {
    if (finished) return renderCompletion();
    switch (draft.step) {
      case 'lectio':
        return renderLectio();
      case 'meditatio':
        return renderMeditatio();
      case 'oratio':
        return renderOratio();
      case 'contemplatio':
        return renderContemplatio();
      case 'actio':
        return renderActio();
      default:
        return renderLectio();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-amber-50/80 to-white dark:from-stone-950 dark:to-stone-900">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {renderIntro()}
        {started && (
          <>
            {renderConfig()}
            <div className="flex justify-between items-center">
              <div className="text-sm text-stone-600 dark:text-stone-300">Progresso</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">Não pulamos etapas na primeira vez; depois você pode navegar livremente.</div>
            </div>
            {renderProgress()}
            {mainContent()}
          </>
        )}

        {!started && (
          <div className="rounded-2xl border border-amber-200 dark:border-indigo-800 bg-white dark:bg-stone-900 p-6 shadow-sm flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-600 dark:text-stone-300">Clique em começar para iniciar sua Lectio de hoje. Você pode retomar um rascunho salvo ou iniciar do zero.</p>
            </div>
            <button
              onClick={handleStart}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
            >
              Começar agora
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="rounded-2xl border border-amber-200 dark:border-indigo-800 bg-white dark:bg-stone-900 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200 font-semibold">Lectio anteriores</p>
                <p className="text-sm text-stone-600 dark:text-stone-300">Últimas sessões salvas neste dispositivo.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {history.slice(0,6).map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedHistory(item)}
                  className="text-left rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-4 space-y-1 hover:border-amber-300 dark:hover:border-indigo-600 transition-colors"
                >
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{item.passage}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{new Date(item.date).toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">Oratio: {item.oratio || '—'}</p>
                  {item.actio?.commitment && (
                    <p className="text-xs text-amber-700 dark:text-amber-300">Actio: {item.actio.commitment}</p>
                  )}
                  <p className="text-[11px] text-amber-700 dark:text-indigo-200 mt-2 font-semibold">Ver detalhes</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedHistory(null)} />
          <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200 font-semibold">Sessão salva</p>
                <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">{selectedHistory.passage}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{formatDateTime(selectedHistory.date)}</p>
              </div>
              <button onClick={() => setSelectedHistory(null)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-sm text-stone-700 dark:text-stone-200">
              <div className="rounded-lg border border-stone-200 dark:border-stone-800 p-3">
                <p className="text-xs uppercase tracking-wide text-stone-500">Leitura</p>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{selectedHistory.lectioSeconds || 0}s</p>
              </div>
              <div className="rounded-lg border border-stone-200 dark:border-stone-800 p-3">
                <p className="text-xs uppercase tracking-wide text-stone-500">Contemplatio</p>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{selectedHistory.contemplatioSeconds || 0}s</p>
              </div>
              <div className="rounded-lg border border-stone-200 dark:border-stone-800 p-3">
                <p className="text-xs uppercase tracking-wide text-stone-500">Actio</p>
                <p className="font-semibold text-stone-800 dark:text-stone-100">{selectedHistory.actio?.commitment || '—'}</p>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-stone-500">Oratio</p>
              <p className="text-sm text-stone-800 dark:text-stone-100 leading-relaxed whitespace-pre-wrap">{selectedHistory.oratio || 'Nenhuma anotação.'}</p>
            </div>

            {selectedHistory.meditatio?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-stone-500">Meditatio</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedHistory.meditatio.map(item => (
                    <div key={item.question} className="rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 space-y-1">
                      <p className="text-xs font-semibold text-stone-600 dark:text-stone-300 leading-snug">{item.question}</p>
                      <p className="text-sm text-stone-800 dark:text-stone-100 leading-relaxed whitespace-pre-wrap">{item.answer || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedHistory.actio?.commitment && (
              <div className="rounded-xl border border-amber-200 dark:border-indigo-800 bg-amber-50 dark:bg-indigo-900/40 p-4 space-y-1">
                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200 font-semibold">Actio</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedHistory.actio.commitment}</p>
                <p className="text-xs text-stone-600 dark:text-stone-300">Lembrete: {selectedHistory.actio.reminder ? 'Sim' : 'Não'} · Concluído: {selectedHistory.actio.done ? 'Sim' : 'Não'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showGuideModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowGuideModal(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center dark:bg-indigo-800/50 dark:text-indigo-100">
                <HandHeart size={24} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-indigo-200 font-semibold">O que é a Lectio Divina?</p>
                <h2 className="font-display text-xl text-stone-900 dark:text-stone-100">Origem, sentido e prática</h2>
              </div>
              <button onClick={() => setShowGuideModal(false)} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-sm text-stone-700 dark:text-stone-200">
              <p>
                A Lectio Divina surgiu nos mosteiros beneditinos como um caminho simples e profundo de encontro com Deus pela Palavra. Foi consolidada por São Gregório Magno e preservada ao longo dos séculos como prática diária de leitura, meditação, oração e contemplação.
              </p>
              <p className="italic text-stone-600 dark:text-stone-300">“A Palavra de Deus é viva e eficaz” (Hb 4,12) — por isso a acolhemos com reverência e deixamos que ela molde o coração.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Comece com o sinal da cruz e uma Ave Maria, pedindo a luz do Espírito Santo.</li>
                <li>Lectio: leia devagar 2-3 vezes, deixe uma palavra ressoar.</li>
                <li>Meditatio: pergunte o que Deus lhe diz hoje.</li>
                <li>Oratio: responda em oração pessoal.</li>
                <li>Contemplatio: descanse em silêncio na presença amorosa.</li>
                <li>Actio: escolha um gesto concreto para viver a Palavra.</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowGuideModal(false)} className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-sm text-stone-700 dark:text-stone-200">Fechar</button>
              {!started && (
                <button
                  onClick={() => { setShowGuideModal(false); handleStart(); }}
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                  Começar Lectio agora
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LectioDivina;
