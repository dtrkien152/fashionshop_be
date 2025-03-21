interface IPostDetail {
  id: number;
  code: string;
  title: string;
  author: string;
  content: string;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  categoryId: number;
  categoryName: string;
  comments:ICommentDetail[];
}


interface ICommentDetail {
  id: number;
  userId: number;
  fullName: string;
  content: string;
  createdAt: Date;
}

interface IPostWithComments {
  id: number;
  code?:string;
  title: string;
  content: string;
  author: string;
  thumbnailUrl: string;
  isActive: boolean;
  createdAt: Date;
  categoryId: number;
  categoryName: string;
  comments?: ICommentDetail[];
}

interface IPostQueryParams {
  categoryId: number;
  page?: number;
  size?: number;
}

interface ICategoryWithPostCount {
  id: number;
  name: string;
  postCount: number;
}