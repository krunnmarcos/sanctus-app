import { Book, PatristicComment } from './types';

export const THEME_COLORS = {
  yellow: 'bg-yellow-200 dark:bg-yellow-900/40',
  green: 'bg-green-200 dark:bg-green-900/40',
  blue: 'bg-blue-200 dark:bg-blue-900/40',
  pink: 'bg-rose-200 dark:bg-rose-900/40',
};

// Helper para criar livros sem texto completo para a demo
const createPlaceholderBook = (id: string, name: string, abbreviation: string, category: Book['category']): Book => ({
  id,
  name,
  abbreviation,
  category,
  chapters: [
    {
      number: 1,
      verses: [
        {
          id: `${id}:1:1`,
          number: 1,
          text: 'Texto demonstrativo. Selecione Gênesis, Salmos ou João para ver o conteúdo completo nesta versão de teste.'
        },
        {
          id: `${id}:1:2`,
          number: 2,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      ]
    }
  ]
});

export const MOCK_BIBLE: Book[] = [
  // --- PENTATEUCO ---
  {
    id: 'GEN',
    name: 'Gênesis',
    abbreviation: 'Gn',
    category: 'Pentateuco',
    chapters: [
      {
        number: 1,
        verses: [
          { id: 'GEN:1:1', number: 1, text: 'No princípio, Deus criou o céu e a terra.' },
          { id: 'GEN:1:2', number: 2, text: 'A terra estava informe e vazia; as trevas cobriam o abismo e o Espírito de Deus pairava sobre as águas.' },
          { id: 'GEN:1:3', number: 3, text: 'Deus disse: "Faça-se a luz!" E a luz foi feita.' },
          { id: 'GEN:1:4', number: 4, text: 'Deus viu que a luz era boa, e separou a luz das trevas.' },
          { id: 'GEN:1:5', number: 5, text: 'Deus chamou à luz "dia", e às trevas "noite". Houve uma tarde e uma manhã: o primeiro dia.' },
        ]
      },
      {
        number: 2,
        verses: [
          { id: 'GEN:2:1', number: 1, text: 'Assim foram concluídos o céu e a terra, com todo o seu exército.' },
          { id: 'GEN:2:2', number: 2, text: 'No sétimo dia, Deus concluiu toda a obra que tinha feito; e no sétimo dia repousou de toda a obra que fizera.' },
        ]
      }
    ]
  },
  createPlaceholderBook('EX', 'Êxodo', 'Ex', 'Pentateuco'),
  createPlaceholderBook('LV', 'Levítico', 'Lv', 'Pentateuco'),
  createPlaceholderBook('NM', 'Números', 'Nm', 'Pentateuco'),
  createPlaceholderBook('DT', 'Deuteronômio', 'Dt', 'Pentateuco'),

  // --- HISTÓRICOS (AT) ---
  createPlaceholderBook('JS', 'Josué', 'Js', 'Históricos'),
  createPlaceholderBook('JZ', 'Juízes', 'Jz', 'Históricos'),
  createPlaceholderBook('RT', 'Rute', 'Rt', 'Históricos'),
  createPlaceholderBook('1SM', '1 Samuel', '1Sm', 'Históricos'),
  createPlaceholderBook('2SM', '2 Samuel', '2Sm', 'Históricos'),
  createPlaceholderBook('1RS', '1 Reis', '1Rs', 'Históricos'),
  createPlaceholderBook('2RS', '2 Reis', '2Rs', 'Históricos'),
  createPlaceholderBook('1CR', '1 Crônicas', '1Cr', 'Históricos'),
  createPlaceholderBook('2CR', '2 Crônicas', '2Cr', 'Históricos'),
  createPlaceholderBook('ED', 'Esdras', 'Ed', 'Históricos'),
  createPlaceholderBook('NE', 'Neemias', 'Ne', 'Históricos'),
  createPlaceholderBook('TB', 'Tobias', 'Tb', 'Históricos'),
  createPlaceholderBook('JDT', 'Judite', 'Jt', 'Históricos'),
  createPlaceholderBook('ET', 'Ester', 'Et', 'Históricos'),
  createPlaceholderBook('1MC', '1 Macabeus', '1Mc', 'Históricos'),
  createPlaceholderBook('2MC', '2 Macabeus', '2Mc', 'Históricos'),

  // --- SAPIENCIAIS ---
  createPlaceholderBook('JOB', 'Jó', 'Jó', 'Sapienciais'),
  {
    id: 'SL',
    name: 'Salmos',
    abbreviation: 'Sl',
    category: 'Sapienciais',
    chapters: [
      {
        number: 1,
        verses: [
          { id: 'SL:1:1', number: 1, text: 'Feliz o homem que não segue o conselho dos ímpios, não se detém no caminho dos pecadores nem se assenta na roda dos zombadores.' },
          { id: 'SL:1:2', number: 2, text: 'Antes, seu prazer está na lei do Senhor, e nessa lei medita dia e noite.' },
          { id: 'SL:1:3', number: 3, text: 'Ele é como árvore plantada junto d\'água corrente: dá fruto no tempo devido e suas folhas não murcham; tudo o que faz prospera.' },
        ]
      },
      {
        number: 23,
        verses: [
          { id: 'SL:23:1', number: 1, text: 'O Senhor é meu pastor; nada me faltará.' },
          { id: 'SL:23:2', number: 2, text: 'Em verdes prados me faz repousar. Conduz-me junto às águas tranquilas.' },
          { id: 'SL:23:3', number: 3, text: 'Refrigera minha alma e me guia por veredas seguras por causa do seu nome.' },
        ]
      }
    ]
  },
  createPlaceholderBook('PV', 'Provérbios', 'Pr', 'Sapienciais'),
  createPlaceholderBook('EC', 'Eclesiastes', 'Ecl', 'Sapienciais'),
  createPlaceholderBook('CT', 'Cântico dos Cânticos', 'Ct', 'Sapienciais'),
  createPlaceholderBook('SB', 'Sabedoria', 'Sb', 'Sapienciais'),
  createPlaceholderBook('ECF', 'Eclesiástico', 'Eclo', 'Sapienciais'),

  // --- PROFETAS ---
  createPlaceholderBook('IS', 'Isaías', 'Is', 'Profetas'),
  createPlaceholderBook('JR', 'Jeremias', 'Jr', 'Profetas'),
  createPlaceholderBook('LM', 'Lamentações', 'Lm', 'Profetas'),
  createPlaceholderBook('EZ', 'Ezequiel', 'Ez', 'Profetas'),
  createPlaceholderBook('DN', 'Daniel', 'Dn', 'Profetas'),
  createPlaceholderBook('OS', 'Oseias', 'Os', 'Profetas'),
  createPlaceholderBook('JL', 'Joel', 'Jl', 'Profetas'),
  createPlaceholderBook('AM', 'Amós', 'Am', 'Profetas'),
  createPlaceholderBook('OB', 'Obadias', 'Ob', 'Profetas'),
  createPlaceholderBook('JN', 'Jonas', 'Jn', 'Profetas'),
  createPlaceholderBook('MQ', 'Miquéias', 'Mq', 'Profetas'),
  createPlaceholderBook('NA', 'Naum', 'Na', 'Profetas'),
  createPlaceholderBook('HC', 'Habacuque', 'Hc', 'Profetas'),
  createPlaceholderBook('SF', 'Sofonias', 'Sf', 'Profetas'),
  createPlaceholderBook('AG', 'Ageu', 'Ag', 'Profetas'),
  createPlaceholderBook('ZC', 'Zacarias', 'Zc', 'Profetas'),
  createPlaceholderBook('ML', 'Malaquias', 'Ml', 'Profetas'),

  // --- EVANGELHOS ---
  createPlaceholderBook('MT', 'Mateus', 'Mt', 'Evangelhos'),
  createPlaceholderBook('MC', 'Marcos', 'Mc', 'Evangelhos'),
  createPlaceholderBook('LC', 'Lucas', 'Lc', 'Evangelhos'),
  {
    id: 'JO',
    name: 'João',
    abbreviation: 'Jo',
    category: 'Evangelhos',
    chapters: [
      {
        number: 1,
        verses: [
          { id: 'JO:1:1', number: 1, text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.' },
          { id: 'JO:1:2', number: 2, text: 'Ele estava no princípio com Deus.' },
          { id: 'JO:1:3', number: 3, text: 'Todas as coisas foram feitas por meio dele, e sem ele nada foi feito de tudo o que existe.' },
          { id: 'JO:1:4', number: 4, text: 'Nele estava a vida, e a vida era a luz dos homens.' },
          { id: 'JO:1:5', number: 5, text: 'A luz brilha nas trevas, e as trevas não a derrotaram.' },
        ]
      }
    ]
  },

  // --- CARTAS ---
  createPlaceholderBook('RM', 'Romanos', 'Rm', 'Cartas'),
  createPlaceholderBook('1CO', '1 Coríntios', '1Co', 'Cartas'),
  createPlaceholderBook('2CO', '2 Coríntios', '2Co', 'Cartas'),
  createPlaceholderBook('GL', 'Gálatas', 'Gl', 'Cartas'),
  createPlaceholderBook('EF', 'Efésios', 'Ef', 'Cartas'),
  createPlaceholderBook('FP', 'Filipenses', 'Fl', 'Cartas'),
  createPlaceholderBook('CL', 'Colossenses', 'Cl', 'Cartas'),
  createPlaceholderBook('1TS', '1 Tessalonicenses', '1Ts', 'Cartas'),
  createPlaceholderBook('2TM', '2 Timóteo', '2Tm', 'Cartas'),
  createPlaceholderBook('HB', 'Hebreus', 'Hb', 'Cartas'),
  createPlaceholderBook('TG', 'Tiago', 'Tg', 'Cartas'),
  createPlaceholderBook('1PE', '1 Pedro', '1Pe', 'Cartas'),
  createPlaceholderBook('1JO', '1 João', '1Jo', 'Cartas'),

  // --- APOCALIPSE ---
  createPlaceholderBook('AP', 'Apocalipse', 'Ap', 'Apocalipse'),
];

export const PATRISTIC_COMMENTS: Record<string, PatristicComment[]> = {
  'GEN:1:1': [
    {
      id: 'pat-aug-conf',
      verseId: 'GEN:1:1',
      author: 'Santo Agostinho',
      work: 'Confissões, XI',
      text: 'Deus cria o tempo ao criar o mundo; não há antes de Deus, porque Ele mesmo é o princípio de tudo.'
    },
    {
      id: 'pat-bas-hex',
      verseId: 'GEN:1:1',
      author: 'São Basílio',
      work: 'Homilias sobre o Hexameron',
      text: 'O princípio aqui anunciado não é apenas um instante inicial, mas a ordem sábia com que Deus dispôs todas as coisas.'
    }
  ],
  'GEN:1:3': [
    {
      id: 'pat-chr-light',
      verseId: 'GEN:1:3',
      author: 'São João Crisóstomo',
      work: 'Homilias sobre o Gênesis',
      text: 'Ele disse e a luz existiu, mostrando que a Palavra de Deus possui força criadora sem auxílio de instrumentos.'
    }
  ],
  'SL:1:2': [
    {
      id: 'pat-jer-ps1',
      verseId: 'SL:1:2',
      author: 'São Jerônimo',
      work: 'Comentário aos Salmos',
      text: 'Meditar dia e noite é manter a Escritura na memória, de modo que os pensamentos sejam moldados pela Lei divina.'
    }
  ],
  'SL:23:1': [
    {
      id: 'pat-greg-pastor',
      verseId: 'SL:23:1',
      author: 'São Gregório de Nissa',
      work: 'Homilia sobre o Salmo 23',
      text: 'O Bom Pastor guia sem violência; alimenta-nos com o conhecimento de Deus e sacia a alma sedenta.'
    }
  ],
  'JO:1:1': [
    {
      id: 'pat-ath-logos',
      verseId: 'JO:1:1',
      author: 'Santo Atanásio',
      work: 'Contra os Arianos',
      text: 'O Verbo é consubstancial ao Pai; sendo Deus, não pode ser contado entre as criaturas.'
    },
    {
      id: 'pat-aug-prol',
      verseId: 'JO:1:1',
      author: 'Santo Agostinho',
      work: 'Tractatus in Ioannem',
      text: 'João começa pelo alto para que ninguém confunda o Verbo com um homem comum; Ele é Deus desde sempre.'
    }
  ],
  'JO:1:5': [
    {
      id: 'pat-ori-light',
      verseId: 'JO:1:5',
      author: 'Orígenes',
      work: 'Comentário ao Evangelho de João',
      text: 'A luz verdadeira não é vencida; mesmo quando rejeitada, continua a brilhar e chamar à conversão.'
    }
  ]
};

// Caminho default para a Bíblia carregada de JSON estático
const DEFAULT_BIBLE_PATH = '/data/porblivre/bible.json';

export const loadBibleFromStatic = async (path: string = DEFAULT_BIBLE_PATH): Promise<Book[]> => {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Falha ao carregar Bíblia em ${path}`);
  }
  const data = await res.json();
  return data as Book[];
};
