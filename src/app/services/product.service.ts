// src/services/product.service.ts

import {Op, Order, WhereOptions} from 'sequelize';
import {Category, IProduct, Product, ProductSubDetail, Site, Stock} from '../models';
import {injectable} from 'tsyringe';
import {IProductDetailResponse, IProductFilterParams} from '../dto/product.dto';
import {SORT_BY_ENUM} from '../constants';

@injectable()
class ProductService {
    constructor() {
    }

    async searchProducts({
                             keyword,
                             categoryId,
                             sortBy = SORT_BY_ENUM.NEWEST,
                             limit = 10,
                             page = 1,
                         }: IProductFilterParams) {
        const where: WhereOptions<IProduct> = {};
        const offset = (page - 1) * limit;

        // Tìm kiếm theo từ khóa
        if (keyword) {
            where[Op.or] = [
                {name: {[Op.iLike]: `%${keyword}%`}},
                {code: {[Op.iLike]: `%${keyword}%`}},
            ];
        }

        // Lọc theo category
        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Sắp xếp
        const order: Order = [];
        switch (sortBy) {
            case SORT_BY_ENUM.PRICE_ASC:
                order.push(['salePrice', 'ASC']);
                break;
            case SORT_BY_ENUM.PRICE_DESC:
                order.push(['salePrice', 'DESC']);
                break;
            case SORT_BY_ENUM.NEWEST:
                order.push(['createdAt', 'DESC']);
                break;
            case SORT_BY_ENUM.LASTEST:
                order.push(['createdAt', 'ASC']);
                break;
            default:
                order.push(['createdAt', 'DESC']);
                break;
        }

        // Truy vấn dữ liệu
        const {rows, count} = await Product.findAndCountAll({
            where,
            include: [{model: Category, attributes: ['name']}],
            order,
            limit: Number(limit),
            offset,
        });

        return {data: rows, total: count};
    }

    async getProductDetail(productId: number) {
        const where: WhereOptions<IProduct> = { id: productId};

        const product:Product = await Product.findOne({
            where,
            attributes: ['id', 'name'],
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
                {
                    model: ProductSubDetail,
                    attributes: ['id', 'size', 'color', 'isActive'],
                    include: [
                        {
                            model: Stock,
                            attributes: ['unit'],
                        },
                    ],
                },
            ],
        });

        if (!product) return null;

        // Xử lý dữ liệu trả về theo interface IProductDetailResponse
        const response: IProductDetailResponse = {
            product_id: product.id,
            productName: product.name,
            category_id: product.Category?.id || 0,
            category_name: product.Category?.name || '',
            productSubDetails: product.ProductSubDetails.map((subDetail) => ({
                id: subDetail.id,
                size: subDetail.size,
                color: subDetail.color,
                isActive: subDetail.isActive,
                totalQuantity: subDetail.Stocks?.reduce((total, stock) => total + stock.unit, 0) || 0,
            })),
        };

        return response;
    }

}

export default ProductService;
