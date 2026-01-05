export type ViewState = 'dashboard' | 'reader' | 'journal' | 'lectio' | 'liturgia' | 'settings' | 'about';

export interface Verse {
  id: string; // e.g., "GEN:1:1"
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  abbreviation: string;
  category: 'Pentateuco' | 'Históricos' | 'Sapienciais' | 'Profetas' | 'Evangelhos' | 'Cartas' | 'Apocalipse';
  chapters: Chapter[];
}

export interface PatristicComment {
  id: string;
  verseId: string;
  author: string; // e.g., "Santo Agostinho"
  work: string;   // e.g., "Confissões, Livro XI"
  text: string;
}

export interface Highlight {
  verseId: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
}

export interface Note {
  verseId: string;
  content: string;
  createdAt: string;
}

export interface Prayer {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  isAnswered: boolean;
}

export interface ReadingProgress {
  bookId: string;
  chapter: number;
}