export interface NewsInfo {
  title: string;
  date: string;
  reporter: string;
  imageUrl: string;
  summary: string;
  link: string;
  category: 'ALL' | 'REPORT' | 'SOCIETY';
}
