export interface Subtema {
  topico?: string;
  tema?: string;
  descricao: string;
  filosofos?: Array<{ nome: string; descricao: string }>;
  correntes?: Array<{ nome: string; descricao: string }>;
}

export interface Tema {
  tema: string;
  subtemas: Subtema[];
}

export interface MindMapData {
  titulo: string;
  estrutura: Tema[];
}
