import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CalendarDays,
  Flame,
  Loader2,
  RefreshCw,
  Share2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { AppContext } from '../App';

const BASE_URL = 'http://liturgia.up.railway.app/v2/';

type OpcaoLeitura = {
  referencia?: string;
  titulo?: string;
  texto?: string;
  refrao?: string;
  tipo?: string;
};

type OracaoExtra = {
  titulo?: string;
  texto?: string;
};

type LiturgiaPayload = {
  data: string;
  liturgia: string;
  cor: string;
  oracoes?: {
    coleta?: string;
    oferendas?: string;
    comunhao?: string;
    extras?: OracaoExtra[];
  };
  leituras?: {
    primeiraLeitura?: OpcaoLeitura[];
    salmo?: OpcaoLeitura[];
    segundaLeitura?: OpcaoLeitura[];
    evangelho?: OpcaoLeitura[];
    extras?: OpcaoLeitura[];
  };
  antifonas?: {
    entrada?: string;
    comunhao?: string;
  };
};

const coresLiturgicas: Record<string, { icone: string; hex: string; border?: string }> = {
  Branco: { icone: '⚪', hex: '#FFFFFF', border: '#D4AF37' },
  Vermelho: { icone: '🔴', hex: '#E63946' },
  Verde: { icone: '🟢', hex: '#2ECC71' },
  Roxo: { icone: '🟣', hex: '#9B59B6' },
  Rosa: { icone: '🌸', hex: '#FF69B4' },
  Preto: { icone: '⚫', hex: '#2C3E50' },
};

const formatDisplayDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year) return dateStr;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const LiturgiaDiaria: React.FC = () => {
  const app = useContext(AppContext);
  const [liturgia, setLiturgia] = useState<LiturgiaPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leituras' | 'oracoes' | 'completo'>('leituras');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [opcaoIndex, setOpcaoIndex] = useState({
    primeiraLeitura: 0,
    segundaLeitura: 0,
    salmo: 0,
    evangelho: 0,
    extras: 0,
  });

  const corInfo = useMemo(() => {
    if (!liturgia) return null;
    const key = Object.keys(coresLiturgicas).find(k => k.toLowerCase() === liturgia.cor?.toLowerCase());
    return key ? coresLiturgicas[key] : null;
  }, [liturgia]);

  const fetchLiturgia = async (isoDate?: string) => {
    setLoading(true);
    setErro(null);
    const url = isoDate ? `${BASE_URL}?data=${isoDate}` : BASE_URL;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Resposta inválida da API');
      }
      const data = await res.json();
      setLiturgia(data as LiturgiaPayload);
    } catch (err) {
      console.error('Erro ao carregar liturgia', err);
      setErro('Não foi possível carregar a liturgia.');
      if (isoDate) {
        try {
          const fallbackRes = await fetch(BASE_URL);
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            setLiturgia(data as LiturgiaPayload);
            setErro(null);
          }
        } catch (fallbackError) {
          console.warn('Fallback falhou', fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiturgia(selectedDate);
  }, [selectedDate]);

  const handleShare = async (titulo: string, referencia?: string, texto?: string) => {
    const shareText = `${titulo}${referencia ? ` — ${referencia}` : ''}\n\n${texto || ''}\n\nAcutis · Liturgia Diária`;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: shareText });
      } catch (err) {
        console.warn('Compartilhamento cancelado', err);
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Texto copiado para a área de transferência.');
    } catch (err) {
      alert('Não foi possível copiar o texto.');
    }
  };

  const startLectioDivina = (leitura?: OpcaoLeitura) => {
    if (leitura?.texto) {
      window.localStorage.setItem('lectio-liturgia-prefill', JSON.stringify({
        referencia: leitura.referencia,
        titulo: leitura.titulo,
        texto: leitura.texto,
      }));
    }
    if (app) {
      app.setView('lectio');
    }
  };

  const selectedLeitura = (key: keyof typeof opcaoIndex, items?: OpcaoLeitura[]) => {
    if (!items || !items.length) return null;
    const idx = Math.min(opcaoIndex[key], items.length - 1);
    return items[idx];
  };

  const renderLeituraCard = (
    label: string,
    leitura: OpcaoLeitura | null,
    badgeClass = 'bg-gold-500',
    accent = 'border-gold-500'
  ) => {
    if (!leitura) return null;
    return (
      <section className="rounded-2xl bg-white/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white rounded-full ${badgeClass}`}>
              {label}
            </span>
            {leitura.referencia && (
              <p className="text-sm uppercase tracking-wide text-stone-500 dark:text-stone-400">{leitura.referencia}</p>
            )}
            {leitura.titulo && (
              <h3 className="text-xl font-display font-semibold text-stone-900 dark:text-white">{leitura.titulo}</h3>
            )}
          </div>
          <div className="flex gap-2 text-stone-500">
            <button
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Meditar com Lectio Divina"
              onClick={() => startLectioDivina(leitura)}
            >
              <Sparkles size={18} />
            </button>
            <button
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Compartilhar leitura"
              onClick={() => handleShare(label, leitura.referencia, leitura.texto)}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        <div className={`rounded-xl border ${accent} p-4 bg-stone-50/80 dark:bg-stone-900/60 leading-relaxed text-stone-800 dark:text-stone-100 whitespace-pre-line`}>\n          {leitura.texto || 'Texto não disponível.'}
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-stone-600 dark:text-stone-300">
          <button
            className="px-3 py-2 rounded-full bg-gold-600 text-white font-semibold hover:bg-gold-700 transition-colors flex items-center gap-2"
            onClick={() => startLectioDivina(leitura)}
          >
            <Sparkles size={16} /> Meditar com Lectio Divina
          </button>
          <button
            className="px-3 py-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:border-gold-400 flex items-center gap-2"
            onClick={() => handleShare(label, leitura.referencia, leitura.texto)}
          >
            <Share2 size={16} /> Compartilhar
          </button>
          <button className="px-3 py-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-400 flex items-center gap-2">
            <Volume2 size={16} /> Ouvir (em breve)
          </button>
        </div>
      </section>
    );
  };

  const renderSalmoCard = (salmo: OpcaoLeitura | null) => {
    if (!salmo) return null;
    return (
      <section className="rounded-2xl bg-white/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white rounded-full bg-santo-600">
              🎵 Salmo Responsorial
            </span>
            {salmo.referencia && (
              <p className="text-sm uppercase tracking-wide text-stone-500 dark:text-stone-400 mt-2">{salmo.referencia}</p>
            )}
          </div>
          <div className="flex gap-2 text-stone-500">
            <button
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Compartilhar salmo"
              onClick={() => handleShare('Salmo Responsorial', salmo.referencia, salmo.texto)}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        {salmo.refrao && (
          <div className="rounded-xl bg-santo-50 dark:bg-santo-900/20 border border-santo-100 dark:border-santo-700 p-4">
            <strong className="text-santo-800 dark:text-santo-200">Refrão:</strong>
            <p className="mt-1 text-stone-800 dark:text-stone-100">{salmo.refrao}</p>
          </div>
        )}
        <div className="space-y-2 text-stone-800 dark:text-stone-100 leading-relaxed">
          {(salmo.texto || '').split('\n').filter(Boolean).map((verso, idx) => (
            <p key={idx} className="rounded-lg px-3 py-2 bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
              {verso}
            </p>
          ))}
        </div>
      </section>
    );
  };

  const renderOracaoCard = (titulo: string, texto?: string) => {
    if (!texto) return null;
    return (
      <section className="rounded-2xl border border-sky-100 dark:border-sky-800 bg-white dark:bg-stone-900 p-5 shadow-sm space-y-2">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-white flex items-center gap-2">
          <Flame size={18} className="text-gold-600" /> {titulo}
        </h3>
        <p className="text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-line italic">{texto}</p>
      </section>
    );
  };

  const renderAntifonas = () => {
    if (!liturgia?.antifonas) return null;
    return (
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm space-y-3">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-white">🎶 Antífonas</h3>
        {liturgia.antifonas.entrada && (
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Entrada</p>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{liturgia.antifonas.entrada}</p>
          </div>
        )}
        {liturgia.antifonas.comunhao && (
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-400">Comunhão</p>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{liturgia.antifonas.comunhao}</p>
          </div>
        )}
      </section>
    );
  };

  const renderTabs = () => (
    <div className="flex gap-2 mb-6 border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
      {[
        { key: 'leituras', label: '📖 Leituras' },
        { key: 'oracoes', label: '🙏 Orações' },
        { key: 'completo', label: '📋 Completo' },
      ].map(tab => (
        <button
          key={tab.key}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'text-gold-700 border-gold-500 dark:text-gold-200 dark:border-gold-300' : 'text-stone-500 border-transparent hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'}`}
          onClick={() => setActiveTab(tab.key as typeof activeTab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-gradient-to-b from-white via-white to-santo-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-4 animate-pulse">
          <div className="h-7 w-64 rounded-lg bg-stone-200/80 dark:bg-stone-800" />
          <div className="h-6 w-80 rounded-lg bg-stone-200/80 dark:bg-stone-800" />
          <div className="h-12 w-full rounded-2xl bg-stone-200/80 dark:bg-stone-800" />
          <div className="h-40 w-full rounded-2xl bg-stone-200/80 dark:bg-stone-800" />
          <div className="h-40 w-full rounded-2xl bg-stone-200/80 dark:bg-stone-800" />
        </div>
      </div>
    );
  }

  if (erro || !liturgia) {
    return (
      <div className="h-full overflow-y-auto flex items-center justify-center bg-gradient-to-b from-white via-white to-santo-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-200">
            <Loader2 className="animate-spin" />
          </div>
          <p className="text-lg font-semibold text-stone-900 dark:text-white">Não foi possível carregar a liturgia.</p>
          <p className="text-stone-600 dark:text-stone-300 text-sm">Verifique sua conexão e tente novamente.</p>
          <button
            onClick={() => fetchLiturgia(selectedDate)}
            className="px-4 py-2 rounded-full bg-gold-600 text-white font-semibold hover:bg-gold-700 inline-flex items-center gap-2"
          >
            <RefreshCw size={16} className="animate-spin" /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const headerDate = formatDisplayDate(liturgia.data);
  const corBadgeStyle = corInfo
    ? { backgroundColor: corInfo.hex, color: '#111', borderColor: corInfo.border || corInfo.hex }
    : undefined;

  const primeira = selectedLeitura('primeiraLeitura', liturgia.leituras?.primeiraLeitura);
  const segunda = selectedLeitura('segundaLeitura', liturgia.leituras?.segundaLeitura);
  const salmo = selectedLeitura('salmo', liturgia.leituras?.salmo);
  const evangelho = selectedLeitura('evangelho', liturgia.leituras?.evangelho);
  const extraLeitura = selectedLeitura('extras', liturgia.leituras?.extras);

  const renderSelect = (key: keyof typeof opcaoIndex, items?: OpcaoLeitura[]) => {
    if (!items || items.length <= 1) return null;
    return (
      <div className="inline-flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
        <ArrowLeftRight size={14} />
        <select
          value={opcaoIndex[key]}
          onChange={(e) => setOpcaoIndex(prev => ({ ...prev, [key]: Number(e.target.value) }))}
          className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm"
        >
          {items.map((item, idx) => (
            <option key={`${key}-${idx}`} value={idx}>
              {item.titulo || item.tipo || `Opção ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const LeiturasView = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        {renderSelect('primeiraLeitura', liturgia.leituras?.primeiraLeitura)}
        {renderSelect('segundaLeitura', liturgia.leituras?.segundaLeitura)}
        {renderSelect('salmo', liturgia.leituras?.salmo)}
        {renderSelect('evangelho', liturgia.leituras?.evangelho)}
        {renderSelect('extras', liturgia.leituras?.extras)}
      </div>
      {renderLeituraCard('📕 Primeira Leitura', primeira)}
      {renderSalmoCard(salmo)}
      {segunda && renderLeituraCard('📗 Segunda Leitura', segunda, 'bg-emerald-600', 'border-emerald-500')}
      {renderLeituraCard('✝️ Evangelho', evangelho, 'bg-red-600', 'border-red-500')}
      {extraLeitura && renderLeituraCard('📜 Leitura Extra', extraLeitura, 'bg-indigo-600', 'border-indigo-500')}
    </div>
  );

  const OracoesView = (
    <div className="space-y-4">
      {renderOracaoCard('🙏 Oração da Coleta', liturgia.oracoes?.coleta)}
      {renderOracaoCard('🍞 Oração sobre as Oferendas', liturgia.oracoes?.oferendas)}
      {renderOracaoCard('✝️ Oração depois da Comunhão', liturgia.oracoes?.comunhao)}
      {liturgia.oracoes?.extras?.map((extra, idx) => renderOracaoCard(`✨ ${extra.titulo || 'Oração especial'}`, extra.texto))}
      {renderAntifonas()}
    </div>
  );

  const CompletoView = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-stone-400">Celebração</p>
        <p className="text-lg font-semibold text-stone-900 dark:text-white">{liturgia.liturgia}</p>
        <p className="text-stone-600 dark:text-stone-300">{headerDate}</p>
      </div>
      {renderOracaoCard('🙏 Oração da Coleta', liturgia.oracoes?.coleta)}
      {renderLeituraCard('📕 Primeira Leitura', primeira)}
      {renderSalmoCard(salmo)}
      {segunda && renderLeituraCard('📗 Segunda Leitura', segunda, 'bg-emerald-600', 'border-emerald-500')}
      {renderLeituraCard('✝️ Evangelho', evangelho, 'bg-red-600', 'border-red-500')}
      {renderOracaoCard('🍞 Oração sobre as Oferendas', liturgia.oracoes?.oferendas)}
      {renderOracaoCard('✝️ Oração depois da Comunhão', liturgia.oracoes?.comunhao)}
      {renderAntifonas()}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white via-white to-santo-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="rounded-3xl bg-white/90 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm p-6 sm:p-8 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between gap-4 items-start">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <CalendarDays size={22} className="text-gold-600" /> Liturgia Diária
              </h2>
              <p className="text-sm uppercase tracking-wide text-stone-500 dark:text-stone-400">{headerDate}</p>
              <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">{liturgia.liturgia}</p>
              {liturgia.cor && (
                <span
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold border"
                  style={corBadgeStyle}
                >
                  {corInfo?.icone || '⚪'} Cor Litúrgica: {liturgia.cor}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => fetchLiturgia(selectedDate)}
                  className="px-3 py-2 rounded-full border border-stone-200 dark:border-stone-700 text-sm font-semibold hover:border-gold-400 flex items-center gap-2"
                >
                  <RefreshCw size={16} /> Atualizar
                </button>
                <button
                  onClick={() => evangelho && startLectioDivina(evangelho)}
                  className="px-4 py-2 rounded-full bg-gold-600 text-white text-sm font-semibold hover:bg-gold-700 flex items-center gap-2"
                >
                  <Sparkles size={16} /> Meditar Evangelho
                </button>
              </div>
            </div>
          </div>
          {liturgia.cor && corInfo && (
            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: `${corInfo.hex}33` }} aria-hidden="true" />
          )}
        </header>

        {renderTabs()}

        {activeTab === 'leituras' && LeiturasView}
        {activeTab === 'oracoes' && OracoesView}
        {activeTab === 'completo' && CompletoView}

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-white">Lectio Divina</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Use o Evangelho do dia para orar com profundidade.</p>
          </div>
          <button
            onClick={() => evangelho && startLectioDivina(evangelho)}
            className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-2"
          >
            <Sparkles size={16} /> Abrir Lectio com o Evangelho
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiturgiaDiaria;
