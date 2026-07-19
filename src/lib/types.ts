export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: Category;
  tags: string[];
  author: string;
  publishedAt: string;
  views: number;
}
