export interface Content {
  uuid: string;
  title: string;
  previewContent: string;
  publishedAt: string;
  author: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  liked?: boolean;
}
