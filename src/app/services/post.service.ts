import { injectable } from 'tsyringe';
import { Post, Comment, User, PostCategory } from '../models';
import { Sequelize } from 'sequelize-typescript';

@injectable()
class PostService {
  constructor() {}

  async getTopPostLastest(limit:number): Promise<IPostWithComments[]> {
    const posts = await Post.findAll({
      where: { isActive: true }, // Chỉ lấy bài viết đang hoạt động
      include: [
        {
          model: PostCategory,
          attributes: ['id', 'name'],
        }
      ],
      order: [['createdAt', 'DESC']], // Sắp xếp bài viết mới nhất
      limit: limit, // Lấy 5 bài viết gần nhất
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      code:post.code,
      content: post.content,
      author: post.author,
      thumbnailUrl: post.thumbnailUrl,
      isActive: post.isActive,
      createdAt: post.createdAt,
      categoryId: post.postCategoryId,
      categoryName: post.category?.name || 'Unknown'
    }));
  }

  async getPostsByCategory(params: IPostQueryParams) {
    const { categoryId, page = 1, size = 10 } = params;

    const limit = size;
    const offset = (page - 1) * size;

    const where={ postCategoryId: categoryId, isActive: true };
    const { rows: posts, count: totalItems } = await Post.findAndCountAll({
      where: where,
      include: [
        {
          model: PostCategory,
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          attributes: ['id', 'userId', 'content', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'fullName'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / size),
      currentPage: page,
      pageSize: size,
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        code:post.code,
        content: post.content,
        author: post.author,
        thumbnailUrl: post.thumbnailUrl,
        isActive: post.isActive,
        createdAt: post.createdAt,
        categoryId: post.postCategoryId,
        categoryName: post.category?.name || 'Unknown'
      })),
    };
  }


  async getAllCategoriesWithPostCount(): Promise<ICategoryWithPostCount[]> {
    const categories = await PostCategory.findAll({
      attributes: [
        'id',
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'postCount'],
      ],
      include: [
        {
          model: Post,
          attributes: [], // Không lấy thông tin bài viết, chỉ đếm số lượng
        },
      ],
      group: ['PostCategory.id'], // Nhóm theo ID của category
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      postCount: (category as any).getDataValue('postCount') || 0,
    }));
  }

  async getPostDetailByCode(code: string): Promise<IPostDetail | null> {
    const post = await Post.findOne({
      rejectOnEmpty: undefined,
      where: { code, isActive: true },
      include: [
        {
          model: PostCategory,
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          attributes: ['id', 'userId', 'content', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'fullName'],
            },
          ],
        },
      ]
    });

    if (!post) return null;

    return {
      id: post.id,
      code: post.code,
      title: post.title,
      author: post.author,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      isActive: post.isActive,
      createdAt: post.createdAt,
      categoryId: post.postCategoryId,
      categoryName: post.category?.name || 'Unknown',
      comments: post.comments.map((comment) => ({
        id: comment.id,
        userId: comment.userId,
        fullName: comment.user?.fullName || 'Anonymous',
        content: comment.content,
        createdAt: comment.createdAt,
      })),
    };
  }
}

export default PostService;
