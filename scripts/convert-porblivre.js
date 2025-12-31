// Converte o JSON PorBLivreTR (books/chapters/verses) para o formato interno Book[]
// Uso: node scripts/convert-porblivre.js
// Entrada esperada: PorBLivreTR.json na raiz do projeto
// Saída: public/data/porblivre/bible.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT = path.resolve(__dirname, '..', 'PorBLivreTR.json');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'data', 'porblivre');
const OUTPUT = path.join(OUTPUT_DIR, 'bible.json');

// Mapeamento mínimo: id, abreviação e categoria para 66 livros (protestante). Fallback: mantém nome.
const BOOK_META = {
  Genesis: { id: 'GEN', abbr: 'Gn', display: 'Gênesis', category: 'Pentateuco' },
  Exodus: { id: 'EX', abbr: 'Ex', display: 'Êxodo', category: 'Pentateuco' },
  Leviticus: { id: 'LV', abbr: 'Lv', display: 'Levítico', category: 'Pentateuco' },
  Numbers: { id: 'NM', abbr: 'Nm', display: 'Números', category: 'Pentateuco' },
  Deuteronomy: { id: 'DT', abbr: 'Dt', display: 'Deuteronômio', category: 'Pentateuco' },
  Joshua: { id: 'JS', abbr: 'Js', display: 'Josué', category: 'Históricos' },
  Judges: { id: 'JZ', abbr: 'Jz', display: 'Juízes', category: 'Históricos' },
  Ruth: { id: 'RT', abbr: 'Rt', display: 'Rute', category: 'Históricos' },
  'I Samuel': { id: '1SM', abbr: '1Sm', display: '1 Samuel', category: 'Históricos' },
  'II Samuel': { id: '2SM', abbr: '2Sm', display: '2 Samuel', category: 'Históricos' },
  'I Kings': { id: '1RS', abbr: '1Rs', display: '1 Reis', category: 'Históricos' },
  'II Kings': { id: '2RS', abbr: '2Rs', display: '2 Reis', category: 'Históricos' },
  'I Chronicles': { id: '1CR', abbr: '1Cr', display: '1 Crônicas', category: 'Históricos' },
  'II Chronicles': { id: '2CR', abbr: '2Cr', display: '2 Crônicas', category: 'Históricos' },
  Ezra: { id: 'EZR', abbr: 'Esd', display: 'Esdras', category: 'Históricos' },
  Nehemiah: { id: 'NE', abbr: 'Ne', display: 'Neemias', category: 'Históricos' },
  Esther: { id: 'ET', abbr: 'Est', display: 'Ester', category: 'Históricos' },
  Job: { id: 'JOB', abbr: 'Jó', display: 'Jó', category: 'Sapienciais' },
  Psalms: { id: 'SL', abbr: 'Sl', display: 'Salmos', category: 'Sapienciais' },
  Proverbs: { id: 'PV', abbr: 'Pv', display: 'Provérbios', category: 'Sapienciais' },
  Ecclesiastes: { id: 'EC', abbr: 'Ecl', display: 'Eclesiastes', category: 'Sapienciais' },
  'Song of Solomon': { id: 'CT', abbr: 'Ct', display: 'Cântico dos Cânticos', category: 'Sapienciais' },
  Isaiah: { id: 'IS', abbr: 'Is', display: 'Isaías', category: 'Profetas' },
  Jeremiah: { id: 'JR', abbr: 'Jr', display: 'Jeremias', category: 'Profetas' },
  Lamentations: { id: 'LM', abbr: 'Lm', display: 'Lamentações', category: 'Profetas' },
  Ezekiel: { id: 'EZ', abbr: 'Ez', display: 'Ezequiel', category: 'Profetas' },
  Daniel: { id: 'DN', abbr: 'Dn', display: 'Daniel', category: 'Profetas' },
  Hosea: { id: 'OS', abbr: 'Os', display: 'Oseias', category: 'Profetas' },
  Joel: { id: 'JL', abbr: 'Jl', display: 'Joel', category: 'Profetas' },
  Amos: { id: 'AM', abbr: 'Am', display: 'Amós', category: 'Profetas' },
  Obadiah: { id: 'OB', abbr: 'Ob', display: 'Obadias', category: 'Profetas' },
  Jonah: { id: 'JN', abbr: 'Jn', display: 'Jonas', category: 'Profetas' },
  Micah: { id: 'MQ', abbr: 'Mq', display: 'Miquéias', category: 'Profetas' },
  Nahum: { id: 'NA', abbr: 'Na', display: 'Naum', category: 'Profetas' },
  Habakkuk: { id: 'HC', abbr: 'Hc', display: 'Habacuque', category: 'Profetas' },
  Zephaniah: { id: 'SF', abbr: 'Sf', display: 'Sofonias', category: 'Profetas' },
  Haggai: { id: 'AG', abbr: 'Ag', display: 'Ageu', category: 'Profetas' },
  Zechariah: { id: 'ZC', abbr: 'Zc', display: 'Zacarias', category: 'Profetas' },
  Malachi: { id: 'ML', abbr: 'Ml', display: 'Malaquias', category: 'Profetas' },
  Matthew: { id: 'MT', abbr: 'Mt', display: 'Mateus', category: 'Evangelhos' },
  Mark: { id: 'MC', abbr: 'Mc', display: 'Marcos', category: 'Evangelhos' },
  Luke: { id: 'LC', abbr: 'Lc', display: 'Lucas', category: 'Evangelhos' },
  John: { id: 'JO', abbr: 'Jo', display: 'João', category: 'Evangelhos' },
  Acts: { id: 'AT', abbr: 'At', display: 'Atos dos Apóstolos', category: 'Históricos' },
  Romans: { id: 'RM', abbr: 'Rm', display: 'Romanos', category: 'Cartas' },
  'I Corinthians': { id: '1CO', abbr: '1Co', display: '1 Coríntios', category: 'Cartas' },
  'II Corinthians': { id: '2CO', abbr: '2Co', display: '2 Coríntios', category: 'Cartas' },
  Galatians: { id: 'GL', abbr: 'Gl', display: 'Gálatas', category: 'Cartas' },
  Ephesians: { id: 'EF', abbr: 'Ef', display: 'Efésios', category: 'Cartas' },
  Philippians: { id: 'FP', abbr: 'Fl', display: 'Filipenses', category: 'Cartas' },
  Colossians: { id: 'CL', abbr: 'Cl', display: 'Colossenses', category: 'Cartas' },
  'I Thessalonians': { id: '1TS', abbr: '1Ts', display: '1 Tessalonicenses', category: 'Cartas' },
  'II Thessalonians': { id: '2TS', abbr: '2Ts', display: '2 Tessalonicenses', category: 'Cartas' },
  'I Timothy': { id: '1TM', abbr: '1Tm', display: '1 Timóteo', category: 'Cartas' },
  'II Timothy': { id: '2TM', abbr: '2Tm', display: '2 Timóteo', category: 'Cartas' },
  Titus: { id: 'TT', abbr: 'Tt', display: 'Tito', category: 'Cartas' },
  Philemon: { id: 'FM', abbr: 'Fm', display: 'Filemon', category: 'Cartas' },
  Hebrews: { id: 'HB', abbr: 'Hb', display: 'Hebreus', category: 'Cartas' },
  James: { id: 'TG', abbr: 'Tg', display: 'Tiago', category: 'Cartas' },
  'I Peter': { id: '1PE', abbr: '1Pe', display: '1 Pedro', category: 'Cartas' },
  'II Peter': { id: '2PE', abbr: '2Pe', display: '2 Pedro', category: 'Cartas' },
  'I John': { id: '1JO', abbr: '1Jo', display: '1 João', category: 'Cartas' },
  'II John': { id: '2JO', abbr: '2Jo', display: '2 João', category: 'Cartas' },
  'III John': { id: '3JO', abbr: '3Jo', display: '3 João', category: 'Cartas' },
  Jude: { id: 'JD', abbr: 'Jd', display: 'Judas', category: 'Cartas' },
  'Revelation of John': { id: 'AP', abbr: 'Ap', display: 'Apocalipse', category: 'Apocalipse' },
};

function loadInput() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Arquivo de entrada não encontrado: ${INPUT}`);
  }
  const raw = fs.readFileSync(INPUT, 'utf8');
  return JSON.parse(raw);
}

function normalizeBooks(src) {
  return src.books.map((book) => {
    const meta = BOOK_META[book.name] || { id: book.name.toUpperCase(), abbr: book.name, category: 'Outros' };
    const chapters = (book.chapters || []).map((ch) => {
      const verses = (ch.verses || []).map((v, idx) => ({
        id: `${meta.id}:${ch.chapter}:${idx + 1}`,
        number: idx + 1,
        text: typeof v === 'string' ? v : String(v?.text ?? '')
      }));
      return { number: ch.chapter, verses };
    });
    return {
      id: meta.id,
      name: meta.display || book.name,
      abbreviation: meta.abbr,
      category: meta.category,
      chapters,
    };
  });
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  const src = loadInput();
  const books = normalizeBooks(src);
  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(OUTPUT, JSON.stringify(books, null, 2), 'utf8');
  console.log(`OK: gerado ${OUTPUT}`);
}

main();
