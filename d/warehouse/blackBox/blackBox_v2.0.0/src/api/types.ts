// Create new file

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface CategoryDetail extends Category {
  articles: Array<{
    id: string;
    title: string;
    createdAt: string;
    summary: string;
  }>;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface TagDetail extends Tag {
  articles: Array<{
    id: string;
    title: string;
    createdAt: string;
    summary: string;
  }>;
}