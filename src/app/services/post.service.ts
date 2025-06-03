import { injectable } from 'tsyringe';
import { Post, Comment, User, PostCategory, Category } from '../models';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { IMAGE_DEFAULT, SORT_BY_ENUM } from '../constants';
import { Tags } from '../models/tags.model';
import { GenerateUtils } from '../utils';
import { IPostWithComments, IPostQueryParams, ICategoryWithPostCount, IPostDetail, ICommentDetail } from '../dto/post.dto';

@injectable()
class PostService {
  constructor() {
  }

  async getTopPostLastest(limit: number): Promise<IPostWithComments[]> {
    const posts = await Post.findAll({
      where: { isActive: true }, // Chỉ lấy bài viết đang hoạt động
      include: [
        {
          model: PostCategory,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']], // Sắp xếp bài viết mới nhất
      limit: limit, // Lấy 5 bài viết gần nhất
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      code: post.code,
      content: post.content,
      author: post.author,
      thumbnailUrl: post.thumbnailUrl,
      isActive: post.isActive,
      createdAt: post.createdAt,
      categoryId: post.postCategoryId,
      categoryName: post.category?.name || 'Unknown',
    }));
  }

  async getPostsByCategory(params: IPostQueryParams) {
    const { categoryId, keyword = '', page = 1, size = 10 } = params;

    const limit = size;
    const offset = (page - 1) * size;

    let where: any = { isActive: true };

    // Nếu có categoryId thì lọc theo danh mục
    if (categoryId) {
      where.postCategoryId = categoryId;
    }

    // 🔍 Chỉ tìm theo tiêu đề (`title`)
    if (keyword.trim()) {
      where.title = { [Op.like]: `%${keyword}%` }; // Nếu dùng MySQL / MariaDB
    }

    const { rows: posts, count: totalItems } = await Post.findAndCountAll({
      where,
      include: [
        { model: PostCategory, attributes: ['id', 'name'] },
        {
          model: Comment,
          attributes: ['id', 'userId', 'content', 'createdAt'],
          include: [{ model: User, attributes: ['id', 'fullName'] }],
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
        content: post.content,
        author: post.author,
        code: post.code,
        thumbnailUrl: post.thumbnailUrl,
        isActive: post.isActive,
        createdAt: post.createdAt,
        categoryId: post.postCategoryId,
        categoryName: post.category?.name || 'Unknown',
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
      ],
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
        avatar: comment.user?.avatar || IMAGE_DEFAULT,
        createdAt: comment.createdAt,
      })),
    };

  }

  async addComment(postId: number, userId: number, content: string) {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Bài viết không tồn tại');
    }

    // Thêm bình luận vào DB
    const newComment = await Comment.create({
      postId,
      userId,
      content,
      createdAt: new Date(),
    });

    return newComment;
  }

  async searchByAdmin({ keyword, categoryId, page = 1, limit = 10, sortBy = SORT_BY_ENUM.NEWEST }) {
    const whereCondition: any = {};

    if (keyword) {
      whereCondition.title = { [Op.like]: `%${keyword}%` };
    }

    if (categoryId) {
      whereCondition.postCategoryId = categoryId;
    }

    const offset = (Number(page) - 1) * Number(limit);

    let orderCondition;
    switch (sortBy) {
      case SORT_BY_ENUM.NEWEST:
        orderCondition = [['createdAt', 'DESC']];
        break;
      case SORT_BY_ENUM.LATEST:
        orderCondition = [['createdAt', 'ASC']];
        break;
      default:
        orderCondition = [['createdAt', 'DESC']];
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'title', 'author', 'thumbnailUrl', 'createdAt', 'isActive'],
      include: [
        { model: PostCategory, as: 'category', attributes: ['id', 'name'] },
        { model: Comment, as: 'comments', attributes: ['id'] },
        { model: Tags, as: 'tags', attributes: ['name'] },
      ],
      order: orderCondition,
      limit: Number(limit),
      offset: Number(offset),
      subQuery: false,
    });

    return {
      total: count,
      data: rows,
    };
  }

  async updatePostStatus(postId: number, isActive: boolean) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    post.isActive = isActive;
    await post.save();
    return post;
  }

  async updatePost(postId: number, data: any) {
    const post = await Post.findByPk(postId, { include: [Tags] });

    if (!post) {
      throw new Error('Không tồn tại bài viết');
    }

    // Cập nhật các trường cơ bản
    if (data.title) {
      post.title = data.title;
      // ✅ Tự động tạo code mới từ title khi title được cập nhật
      const newCode = GenerateUtils.slug(data.title);
      
      // Kiểm tra xem code mới có trùng với bài viết khác không (trừ bài viết hiện tại)
      let uniqueCode = newCode;
      const existingPost = await Post.findOne({ 
        where: { 
          code: uniqueCode, 
          id: { [Op.ne]: postId } // Loại trừ bài viết hiện tại
        } 
      });
      if (existingPost) {
        uniqueCode = `${newCode}-${Date.now()}`;
      }
      
      post.code = uniqueCode;
    }
    if (data.author) post.author = data.author;
    if (data.content) post.content = data.content;
    if (data.categoryId) post.postCategoryId = Number(data.categoryId);
    if (typeof data.isActive === 'boolean') post.isActive = data.isActive;
    if (data.thumbnailUrl) post.thumbnailUrl = data.thumbnailUrl; // 🛠 Giữ nguyên nếu không có ảnh mới

    // Cập nhật tags
    if (data.tags) {
      const tagsArray = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags;
      if (Array.isArray(tagsArray)) {
        await Tags.destroy({ where: { postId } }); // Xóa tags cũ
        const newTags = tagsArray.map((tagName: string) => ({ name: tagName, postId }));
        await Tags.bulkCreate(newTags);
      }
    }

    await post.save();
    return post;
  }

  async getRecommendTag(keyword: string) {
// Tìm tất cả tags và đếm số lượng bài viết sử dụng mỗi tag
    const whereCondition = keyword
      ? { name: { [Op.like]: `%${keyword}%` } } // Dùng Op.like thay vì Sequelize.Op.like
      : {};

    const tags = await Tags.findAll({
      attributes: [
        'name',
        [Sequelize.fn('COUNT', Sequelize.col('name')), 'count'], // Đếm số lần xuất hiện của name
      ],
      where: whereCondition,
      group: ['name'],
      order: [[Sequelize.literal('count'), 'DESC']], // Sắp xếp giảm dần theo count
    });

    return tags;
  }

  async createPost(data: any) {
    // ✅ Chuyển đổi `categoryId`
    const postCategoryId = parseInt(data.categoryId, 10);

    // ✅ Kiểm tra danh mục tồn tại
    const categoryExists = await PostCategory.findByPk(postCategoryId);
    if (!categoryExists) {
      throw new Error('Danh mục bài viết không tồn tại');
    }

    // ✅ Chuyển `content` về dạng chuỗi JSON nếu cần
    const content = typeof data.content === 'object'
      ? JSON.stringify(data.content)
      : data.content;

    // ✅ Tự động tạo code từ title
    const code = GenerateUtils.slug(data.title);

    // ✅ Kiểm tra xem code đã tồn tại chưa, nếu có thì thêm timestamp để đảm bảo unique
    let uniqueCode = code;
    const existingPost = await Post.findOne({ where: { code: uniqueCode } });
    if (existingPost) {
      uniqueCode = `${code}-${Date.now()}`;
    }

    // ✅ Tạo bài viết mới
    const post = await Post.create({
      title: data.title,
      code: uniqueCode,
      author: data.author,
      content,
      postCategoryId,
      isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      thumbnailUrl: data.thumbnailUrl || null,
    });

    // ✅ Thêm tags nếu có
    const tags = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags || [];
    if (tags.length > 0) {
      const newTags = tags.map((tagName: string) => ({ name: tagName, postId: post.id }));
      await Tags.bulkCreate(newTags);
    }

    return post;
  }
  async getPostDetailByADMIN(postId: number) {
    const post = await Post.findByPk(postId, {
      include: [
        { model: Tags, attributes: ['name'] }, // Lấy danh sách tags
        { model: PostCategory, attributes: ['id', 'name'] } // Lấy thông tin thể loại
      ],
    });

    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }

    // Format lại dữ liệu trước khi trả về
    return {
      id: post.id,
      title: post.title,
      author: post.author,
      content: post.content,
      categoryId: post.postCategoryId,
      categoryName: post.category ? post.category.name : null,
      thumbnailUrl: post.thumbnailUrl,
      tags: post.tags ? post.tags.map(tag => tag.name) : [],
      status: post.isActive ? 'active' : 'inactive',
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }


}

export default PostService;
