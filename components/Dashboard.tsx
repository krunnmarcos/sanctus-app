import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Book, PlayCircle, Star, ArrowRight, Sun, Sparkles, ExternalLink, Cross, X, Download, Share2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { setCurrentBookId, setCurrentChapter, setView, theme, bible } = context;

  const [santo, setSanto] = useState<{ nome: string; titulo: string; descricao: string; dataLabel: string; url: string } | null>(null);
  const [santoLoading, setSantoLoading] = useState(true);
  const [santoErro, setSantoErro] = useState(false);
  const [evangelho, setEvangelho] = useState<{ referencia: string; bookId: string; chapter: number } | null>(null);
  const [evangelhoErro, setEvangelhoErro] = useState(false);
  const [liturgiaLabel, setLiturgiaLabel] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

  const SANTOS_MOCK: Record<string, { nome: string; titulo: string; descricao: string }> = {
    '12-30': {
      nome: 'São Sabino de Espoleto',
      titulo: 'Bispo e Mártir',
      descricao: 'Bispo corajoso que defendeu a fé durante as perseguições romanas do século IV.',
    },
    '08-28': {
      nome: 'Santo Agostinho',
      titulo: 'Bispo e Doutor da Igreja',
      descricao: 'Grande teólogo e filósofo, autor das Confissões e A Cidade de Deus.',
    },
    '10-01': {
      nome: 'Santa Teresinha do Menino Jesus',
      titulo: 'Doutora da Igreja',
      descricao: 'Carmelita que ensinou o pequeno caminho de confiança e amor infantil.',
    },
    '10-04': {
      nome: 'São Francisco de Assis',
      titulo: 'Fundador',
      descricao: 'Abandonou riquezas para viver pobreza radical e amor à criação de Deus.',
    },
  };

  const formatDateLabel = (d: Date) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  const extrairDescricaoCurta = (texto?: string) => {
    if (!texto) return '';
    const corte = texto.substring(0, 150);
    const ultimo = corte.lastIndexOf(' ');
    return (ultimo > 0 ? corte.substring(0, ultimo) : corte).trim() + '...';
  };

  const extrairTitulo = (texto?: string) => {
    if (!texto) return '';
    const padroes = [/Bispo/i, /Mártir/i, /Doutor da Igreja/i, /Virgem/i, /Fundador/i, /Papa/i];
    for (const p of padroes) {
      const m = texto.match(p);
      if (m) return m[0];
    }
    return 'Santo(a)';
  };

  const normalizarAbreviacao = (valor: string) => valor
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const encontrarLivroPorAbreviacao = (abreviacao: string) => {
    const alvo = normalizarAbreviacao(abreviacao);

    // Heurística para diferenciar Jo (João) de Jó (Jó/Job): prioriza o Evangelho de João.
    if (alvo === 'jo') {
      const evangelhoJoao = bible.find((livro) => livro.id === 'JO');
      if (evangelhoJoao) return evangelhoJoao;
    }

    return bible.find((livro) => normalizarAbreviacao(livro.abbreviation).startsWith(alvo));
  };

  const extrairLivroECapitulo = (referencia: string) => {
    const partes = referencia.trim().split(/\s+/);
    const abreviacao = partes[0]?.replace(/\.$/, '') || '';
    const livro = encontrarLivroPorAbreviacao(abreviacao);
    const capMatch = referencia.match(/(\d+)/);
    const chapter = capMatch ? parseInt(capMatch[1], 10) || 1 : 1;
    if (livro) return { bookId: livro.id, chapter };
    return null;
  };

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    const isLeap = new Date(now.getFullYear(), 1, 29).getMonth() === 1;
    return { day, daysInYear: isLeap ? 366 : 365 };
  };

  const gerarUrlWikipedia = (nome: string) => {
    const nomeFormatado = nome.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const urlDireta = `https://pt.wikipedia.org/wiki/${encodeURIComponent(nome)}`;
    return { urlDireta, urlBusca: `https://pt.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(nomeFormatado)}` };
  };

  const heroReference = 'João 1:1';
  const heroText = 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.';

  const generateShareImage = async (texto: string, referencia: string) => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fundo degradê simples
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#3b2f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Logo texto
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 64px "Times New Roman", serif';
    ctx.fillText('Sanctus', 64, 120);

    // Referência
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 40px "Georgia", serif';
    ctx.fillText(referencia, 64, 220);

    // Texto principal com quebra de linha manual
    ctx.font = '500 42px "Georgia", serif';
    ctx.fillStyle = '#f8fafc';
    const maxWidth = width - 128;
    const lineHeight = 64;
    const words = texto.split(' ');
    let line = '';
    let y = 320;
    for (const word of words) {
      const testLine = line + word + ' ';
      const { width: w } = ctx.measureText(testLine);
      if (w > maxWidth) {
        ctx.fillText(line.trim(), 64, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) ctx.fillText(line.trim(), 64, y);

    // Rodapé
    ctx.font = '500 32px "Arial", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Olha essa passagem que li no app Sanctus', 64, height - 160);
    ctx.fillText('sanctus.app', 64, height - 100);

    return canvas.toDataURL('image/png', 1.0);
  };

  const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  useEffect(() => {
    const buscarSanto = async () => {
      const hoje = new Date();
      const chave = `${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const resp = await fetch('https://liturgiadiaria.site/', { signal: controller.signal });
        clearTimeout(timer);
        const data = await resp.json();
        const nome = data?.santo || SANTOS_MOCK[chave]?.nome || 'Santo Agostinho';
        const tituloApi = extrairTitulo(data?.sobre_santo) || SANTOS_MOCK[chave]?.titulo || 'Bispo e Doutor da Igreja';
        const descricaoApi = extrairDescricaoCurta(data?.sobre_santo) || SANTOS_MOCK[chave]?.descricao || 'Patrono do Sanctus Augustinus. Grande teólogo e filósofo da Igreja.';
        const { urlDireta } = gerarUrlWikipedia(nome);
        setSanto({ nome, titulo: tituloApi, descricao: descricaoApi, dataLabel: formatDateLabel(hoje), url: urlDireta });
      } catch (err) {
        setSantoErro(true);
        const hoje = new Date();
        const fallback = SANTOS_MOCK[chave] || SANTOS_MOCK['08-28'];
        const { urlDireta } = gerarUrlWikipedia(fallback.nome);
        setSanto({ nome: fallback.nome, titulo: fallback.titulo, descricao: fallback.descricao, dataLabel: formatDateLabel(hoje), url: urlDireta });
      } finally {
        setSantoLoading(false);
      }
    };
    buscarSanto();
  }, []);

  useEffect(() => {
    const buscarEvangelho = async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        const resp = await fetch('https://liturgia.up.railway.app/v2/', { signal: controller.signal });
        clearTimeout(timer);
        if (!resp.ok) throw new Error('Falha ao carregar evangelho');
        const data = await resp.json();
        setLiturgiaLabel(data?.liturgia || null);
        const lista = data?.leituras?.evangelho || data?.evangelho;
        const item = Array.isArray(lista) ? lista[0] : undefined;
        const referencia = item?.referencia || 'Mt 5, 1-12';
        const mapeado = extrairLivroECapitulo(referencia);
        setEvangelho({
          referencia,
          bookId: mapeado?.bookId || 'MT',
          chapter: mapeado?.chapter || 1,
        });
      } catch (err) {
        setEvangelhoErro(true);
        setLiturgiaLabel('Liturgia do Dia');
        setEvangelho({ referencia: 'Jo 1, 1-5', bookId: 'JO', chapter: 1 });
      }
    };
    buscarEvangelho();
  }, [bible]);

  const handleContinueReading = () => {
    // In a real app, use stored progress
    setCurrentBookId('GEN'); 
    setView('reader');
  };

  const handleGoToEvangelho = () => {
    const alvo = evangelho || { bookId: 'MT', chapter: 5 };
    setCurrentBookId(alvo.bookId);
    setCurrentChapter(alvo.chapter);
    setView('reader');
  };

  const handleCategoryClick = (cat: string) => {
    const mapa: Record<string, { bookId: string; chapter: number }> = {
      Pentateuco: { bookId: 'GEN', chapter: 1 },
      Salmos: { bookId: 'SL', chapter: 1 },
      Evangelhos: { bookId: 'MT', chapter: 1 },
      Cartas: { bookId: 'RM', chapter: 1 },
    };
    const destino = mapa[cat];
    if (destino) {
      setCurrentBookId(destino.bookId);
      setCurrentChapter(destino.chapter);
      setView('reader');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const shareMessageRaw = `Olha essa passagem que li no app Sanctus: ${heroReference} - ${heroText}`;
  const shareMessage = encodeURIComponent(shareMessageRaw);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareMessage}`;

  const handleShare = async () => {
    try {
      setShareLoading(true);
      const img = await generateShareImage(heroText, heroReference);
      setShareImage(img);

      const supportsWebShare = typeof navigator !== 'undefined' && !!navigator.canShare;
      if (supportsWebShare && img) {
        const file = await dataUrlToFile(img, 'sanctus-compartilhar.png');
        const canShareFile = navigator.canShare && navigator.canShare({ files: [file] });
        if (canShareFile) {
          await navigator.share({
            files: [file],
            text: shareMessageRaw,
            title: 'Sanctus',
          });
          return; // Compartilhado via Web Share, não abre modal
        }
      }

      // Fallback: abre modal com prévia e links
      setShareOpen(true);
    } catch (err) {
      setShareOpen(true);
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-stone-50 dark:bg-black/20">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
        
        {/* Header Greeting */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gold-600 dark:text-gold-500 font-medium tracking-wide uppercase text-xs mb-2">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-stone-900 dark:text-stone-100">
              {getGreeting()}, <span className="italic">Peregrino</span>.
            </h1>
          </div>
          <div className="hidden md:block">
             <div className="flex items-center gap-2 text-stone-500 text-sm bg-white dark:bg-stone-800 px-3 py-1.5 rounded-full shadow-sm border border-stone-100 dark:border-stone-700">
                <Sun size={14} className="text-gold-500" />
                <span>Tempo Comum</span>
             </div>
          </div>
        </div>

        {/* Hero Card: Verse of the Day */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.01]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-100 dark:bg-gold-900/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-70"></div>
          
          <div className="relative p-8 md:p-12 flex flex-col items-center text-center z-10">
            <span className="inline-flex items-center justify-center p-2 rounded-full bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300 mb-6">
              <Star size={16} />
            </span>
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-stone-800 dark:text-stone-100 leading-snug max-w-3xl mb-6">
              "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus."
            </h2>
            <p className="font-sans font-medium text-stone-500 dark:text-stone-400 tracking-wider text-sm uppercase">
              João 1:1
            </p>
            
            <div className="mt-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
               <button className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors">
                 Meditar
               </button>
               <button onClick={handleShare} className="px-4 py-2 bg-transparent border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 rounded-full text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                 Compartilhar
               </button>
            </div>
          </div>
        </div>

        {/* Continue Reading & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg text-stone-800 dark:text-stone-200 mb-1">
                Continuar Leitura
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                Você parou em Gênesis, Capítulo 1
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                    <Book size={20} />
                 </div>
                 <div>
                    <p className="font-serif font-medium text-stone-900 dark:text-stone-100">Gênesis 1</p>
                    <div className="w-32 h-1 bg-stone-100 dark:bg-stone-800 rounded-full mt-1">
                      <div className="w-1/3 h-full bg-gold-500 rounded-full"></div>
                    </div>
                 </div>
              </div>
              <button 
                onClick={handleContinueReading}
                className="w-10 h-10 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <PlayCircle size={20} />
              </button>
            </div>
          </div>

           <div className="bg-bordeaux text-white rounded-xl p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                <div>
                 <h3 className="font-display font-semibold text-lg mb-1">Liturgia do Dia</h3>
                 <p className="text-white/70 text-sm">{liturgiaLabel || 'Liturgia do Dia'}</p>
                </div>
                <div className="space-y-3">
                 <p className="font-serif text-2xl">{evangelho?.referencia || 'Carregando evangelho...'}</p>
                 <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide opacity-80">
                  {evangelhoErro && <span className="text-red-200">Modo offline</span>}
                  <button onClick={handleGoToEvangelho} className="hover:opacity-100 flex items-center gap-1 mt-2">
                    Ler agora <ArrowRight size={12} />
                  </button>
                 </div>
                </div>
             </div>
          </div>
        </div>

        {/* Quick Access Categories */}
        <div>
          <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-4 px-1">Biblioteca</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Pentateuco', 'Salmos', 'Evangelhos', 'Cartas'].map((cat) => (
              <button 
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="group p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-gold-300 dark:hover:border-gold-700 hover:shadow-md transition-all text-left"
              >
                <span className="block w-8 h-1 bg-gold-400 rounded-full mb-3 group-hover:w-12 transition-all"></span>
                <span className="font-serif font-medium text-stone-800 dark:text-stone-200">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Santo do Dia */}
        <section aria-label="Santo do Dia" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-stone-800 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300 font-semibold">
                <Sparkles size={14} />
                <span>Santo do Dia</span>
                <span className="text-stone-400 dark:text-stone-500">{santo?.dataLabel || formatDateLabel(new Date())}</span>
              </div>
              {santoLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                  <div className="h-6 w-64 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                  <div className="h-4 w-56 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                </div>
              ) : santo ? (
                <>
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">{santo.nome}</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold">{santo.titulo}</p>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl">{santo.descricao}</p>
                  <div className="pt-2">
                    <a
                      href={santo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ler biografia completa de ${santo.nome} na Wikipedia`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800"
                    >
                      Saber mais na Wikipedia
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  {santoErro && (
                    <p className="text-xs text-stone-500">Mostrando santo em modo offline.</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-stone-600 dark:text-stone-300">Não foi possível carregar o santo do dia.</p>
              )}
            </div>
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-inner">
              <Cross size={32} />
            </div>
          </div>
        </section>

      </div>

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

export default Dashboard;