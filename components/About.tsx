import React from 'react';
import { Sparkles, BookOpen, Globe2, Cpu, Quote, Zap, HeartHandshake, Calendar, MapPin, ArrowRightCircle, Smartphone, Sun, Moon, Share2, Search, Book, Crosshair, Info } from 'lucide-react';

const timeline = [
  { year: '1991', title: 'Nascimento', detail: 'Londres, 3 de maio' },
  { year: '1998', title: 'Primeira Comunhão', detail: 'Aos 7 anos' },
  { year: '2002', title: 'Site de milagres eucarísticos', detail: 'Pioneiro na evangelização digital' },
  { year: '2006', title: 'Falecimento', detail: 'Monza, 12 de outubro' },
  { year: '2020', title: 'Beatificação', detail: 'Após primeiro milagre reconhecido' },
  { year: '2024', title: 'Milagre da canonização', detail: 'Valeria Valverde, Costa Rica' },
  { year: '2025', title: 'Canonização', detail: '7 de setembro, Vaticano' },
];

const quotes = [
  'Todos nascem como originais, mas muitos morrem como fotocópias.',
  'A Eucaristia é a minha rodovia para o céu.',
  'Estar sempre unido a Jesus: este é o meu programa de vida.',
  'Não eu, mas Deus.',
  'A tristeza é o olhar voltado para si mesmo. A felicidade é o olhar voltado para Deus.',
  'Quanto mais Eucaristia recebermos, mais nos tornaremos semelhantes a Jesus.',
  'Nossa meta deve ser o infinito, não o finito. O infinito é nossa pátria. O céu nos espera.',
  'A internet não é para perder tempo, mas para fazer o bem.',
];

const features = [
  { icon: BookOpen, title: 'Bíblia Completa', desc: 'Navegação fluida, marcações, notas privadas e textos fiéis.' },
  { icon: Crosshair, title: 'Evangelho do Dia', desc: 'Liturgia diária com leituras, salmo e cor litúrgica.' },
  { icon: HeartHandshake, title: 'Santo do Dia', desc: 'Biografias e inspirações diárias da Igreja.' },
  { icon: Sparkles, title: 'Lectio Divina Guiada', desc: 'Quatro etapas de contemplação: ler, meditar, orar, contemplar.' },
  { icon: Book, title: 'Diário Espiritual', desc: 'Espaço seguro para suas orações e reflexões.' },
  { icon: Search, title: 'Busca Avançada', desc: 'Encontre temas, versículos e passagens rapidamente.' },
  { icon: Sun, title: 'Modo Claro/Escuro', desc: 'Visual refinado que acompanha seu momento de oração.' },
  { icon: Share2, title: 'Compartilhamento', desc: 'Envie versículos com templates inspiradores.' },
  { icon: Globe2, title: 'Textos Originais', desc: 'Em breve: grego e hebraico para estudo aprofundado.' },
];

const About: React.FC = () => {
  return (
    <div className="overflow-y-auto h-full bg-gradient-to-b from-white via-white to-santo-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100">
      <section className="relative isolate overflow-hidden px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-100/80 via-white to-white dark:from-gold-900/30 dark:via-stone-900 dark:to-stone-950" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto text-center space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-white shadow-lg ring-4 ring-gold-200/70 dark:ring-gold-800/50 flex items-center justify-center overflow-hidden">
            <img src="/assets/logos/logo%20navbar.png" alt="Logo Acutis" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-gold-700 dark:text-gold-300">A tecnologia a serviço de Deus</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-stone-900 dark:text-white">Acutis — tradição e inovação caminhando juntas</h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-stone-600 dark:text-stone-200">
              Inspirado em São Carlo Acutis, unimos a herança da fé católica ao melhor da tecnologia para aproximar você da Palavra, com beleza, profundidade e acessibilidade.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <span className="px-4 py-2 rounded-full bg-gold-100 text-gold-800 dark:bg-gold-900/40 dark:text-gold-200 flex items-center gap-2"><Cpu size={16} /> Evangelização digital</span>
            <span className="px-4 py-2 rounded-full bg-santo-100 text-santo-800 dark:bg-santo-900/30 dark:text-santo-100 flex items-center gap-2"><Globe2 size={16} /> Padroeiro da Internet</span>
            <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-100 flex items-center gap-2"><BookOpen size={16} /> Bíblia e Lectio</span>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold-700 dark:text-gold-200 uppercase text-xs font-semibold tracking-[0.2em]">
              <Info size={16} /> Quem foi São Carlo Acutis
            </div>
            <h2 className="text-3xl font-display font-semibold text-stone-900 dark:text-white">São Carlo Acutis: o santo da Internet</h2>
            <div className="space-y-4 text-stone-700 dark:text-stone-200 leading-relaxed">
              <p>Carlo Acutis nasceu em Londres em 3 de maio de 1991 e cresceu em Milão. Desde criança, viveu uma fé profunda e uma amizade cotidiana com Jesus na Eucaristia, participando da Missa diária sempre que podia.</p>
              <p>Jogava videogame, programava sites, amava futebol e cachorros — mas também passava horas ajudando os pobres e evangelizando online. Aos 15 anos, criou um site catalogando milagres eucarísticos pelo mundo, convencido de que a internet não era para perder tempo, e sim para fazer o bem.</p>
              <p>Diagnosticado com leucemia fulminante em outubro de 2006, ofereceu seus sofrimentos pela Igreja e pelo Papa. Faleceu em 12 de outubro de 2006. Foi beatificado em 10 de outubro de 2020 e canonizado em 7 de setembro de 2025, tornando-se o primeiro santo millennial e padroeiro da internet.</p>
              <p>Seus milagres reconhecidos incluem a cura de Matheus (Brasil, 2013) e a recuperação de Valeria Valverde (Costa Rica, 2022). Seu corpo permanece exposto para veneração no Santuário do Despojamento, em Assis.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                '1991 — Nascimento em Londres',
                '1998 — Primeira Comunhão',
                '2002 — Catálogo de milagres eucarísticos',
                '2006 — Falecimento em Monza',
                '2020 — Beatificação',
                '2025 — Canonização'
              ].map((item) => (
                <div key={item} className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 px-3 py-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg ring-4 ring-gold-100/70 dark:ring-gold-900/30">
              <img src="/assets/carlo-acutis-registro.jpeg" alt="São Carlo Acutis" className="w-full h-80 object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {timeline.map((item) => (
                <div key={item.year} className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wide text-gold-700 dark:text-gold-200 font-semibold">{item.year}</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{item.title}</span>
                  <span className="text-stone-600 dark:text-stone-300">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16 bg-gold-50/60 dark:bg-gold-900/20 border-t border-b border-gold-100/70 dark:border-gold-800/40">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700 dark:text-gold-200 font-semibold">Por que Acutis?</p>
          <h2 className="text-3xl font-display font-semibold text-stone-900 dark:text-white">Homenagem a quem santificou o digital</h2>
          <p className="text-lg text-stone-700 dark:text-stone-200 max-w-3xl mx-auto">São Carlo viu a tecnologia como caminho de evangelização: bytes viram bênçãos, telas viram janelas para a graça. O app leva seu nome porque partilhamos essa mesma visão.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[{title:'Tecnologia é neutra',desc:'Importa o uso: servir ao bem, não ao ruído.'},{title:'Santificar o digital',desc:'Transformar presença online em testemunho.'},{title:'Exemplo moderno',desc:'Um santo que fala a linguagem da geração conectada.'},{title:'Tradição + futuro',desc:'Fé enraizada, design e inovação contemporâneos.'}].map((item)=>(
              <div key={item.title} className="p-4 rounded-2xl border border-white/60 dark:border-stone-800 bg-white/80 dark:bg-stone-900/70 shadow-sm">
                <p className="font-semibold text-stone-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-santo-700 dark:text-santo-200 font-semibold">Nossa missão</p>
          <h2 className="text-3xl font-display font-semibold text-stone-900 dark:text-white">A tecnologia a serviço da Palavra</h2>
          <p className="text-lg text-stone-700 dark:text-stone-200 max-w-3xl mx-auto">Aproximar você das Escrituras com profundidade, beleza e acessibilidade. Honrar 2000 anos de fé, usando as melhores ferramentas do século XXI.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[{title:'Encontro diário',desc:'Sem barreiras: você e a Palavra.'},{title:'Profundidade',desc:'Textos, comentários e estudo confiável.'},{title:'Oração contemplativa',desc:'Lectio Divina guiada e diário espiritual.'},{title:'Tradição e inovação',desc:'Sabedoria da Igreja com design atual.'},{title:'Disponível em todo lugar',desc:'Disponível online, na palma da sua mão.'},{title:'Inspirado por Carlo',desc:'Santificar o digital como ele fez.'}].map((item)=>(
              <div key={item.title} className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
                <p className="font-semibold text-stone-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16 bg-white dark:bg-stone-900 border-t border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-gold-700 dark:text-gold-200 font-semibold">Funcionalidades</p>
            <h2 className="text-3xl font-display font-semibold text-stone-900 dark:text-white">O que você encontra no Acutis</h2>
            <p className="text-lg text-stone-700 dark:text-stone-200 max-w-3xl mx-auto">Ferramentas devocionais e de estudo para uma vida espiritual consistente, inspiradas na visão de Carlo.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-10 w-10 rounded-full bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-200 flex items-center justify-center mb-3">
                  <Icon size={18} />
                </div>
                <p className="font-semibold text-stone-900 dark:text-white">{title}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16 bg-gradient-to-br from-santo-50 to-white dark:from-stone-950 dark:to-stone-900">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-santo-700 dark:text-santo-200 font-semibold">Palavras de Carlo</p>
          <h2 className="text-3xl font-display font-semibold text-stone-900 dark:text-white">Frases para inspirar sua jornada</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quotes.map((quoteText, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-santo-100 dark:border-stone-800 bg-white/90 dark:bg-stone-900/80 shadow-sm flex flex-col gap-3">
                <Quote className="text-santo-600 dark:text-santo-200" size={18} />
                <p className="text-base text-stone-800 dark:text-stone-100 leading-relaxed">“{quoteText}”</p>
                <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">— São Carlo Acutis</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16 bg-white dark:bg-stone-900 border-t border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700 dark:text-gold-200 font-semibold">Convite</p>
          <h2 className="text-3xl font-display font-semibold text-stone-900 dark:text-white">Agora é sua vez</h2>
          <p className="text-lg text-stone-700 dark:text-stone-200 max-w-3xl mx-auto">São Carlo usou seus dons para aproximar pessoas de Deus. O Acutis continua essa missão no digital.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="px-6 py-3 rounded-full bg-gold-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Começar jornada espiritual <ArrowRightCircle size={18} />
            </button>
            <div className="flex flex-col text-sm text-stone-600 dark:text-stone-300 items-start sm:items-center">
              <span>📅 Festa: 12 de outubro</span>
              <span>📍 Veneração: Assis, Itália</span>
              <span>🙏 “São Carlo, rogai por nós!”</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 py-12 lg:py-16 bg-stone-950 text-stone-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-santo-200 font-semibold">Recursos</p>
            <h3 className="text-2xl font-display font-semibold">Sobre São Carlo Acutis</h3>
            <ul className="space-y-2 text-sm text-stone-200">
              <li>• Biografia completa (Vatican News)</li>
              <li>• Site dos milagres eucarísticos</li>
              <li>• Oração a São Carlo Acutis</li>
              <li>• Santuário em Assis</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-santo-200 font-semibold">Sobre o app</p>
            <h3 className="text-2xl font-display font-semibold">Acutis App</h3>
            <ul className="space-y-2 text-sm text-stone-200">
              <li>• Bíblia: tradução Ave Maria (dados locais em modo offline)</li>
              <li>• Nossa missão</li>
              <li>• Política de privacidade</li>
              <li>• Contato e feedback</li>
              <li>• Versão: 1.0.0</li>
            </ul>
            <p className="text-sm text-stone-300">Feito com 💙 e ☦️ para a glória de Deus.</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-10 text-center bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-lg font-semibold text-white">“Todos nascem como originais, mas muitos morrem como fotocópias.”</p>
          <p className="text-sm text-stone-200 mt-2">Que o Acutis ajude você a viver sua originalidade em Deus. — São Carlo Acutis</p>
          <p className="text-sm text-santo-100 mt-3">🙏 São Carlo, rogai por nós!</p>
        </div>
      </section>
    </div>
  );
};

export default About;
