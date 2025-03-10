import { injectable } from "tsyringe";
import { Category } from "../models";

@injectable()
class CategoryService {
    constructor() {}

    async getAllCategories() {
        return Category.findAll({
            attributes: ['id', 'code', 'name', 'thumbnailUrl', 'isActive'],
            where: { isActive: true }
        });
    }
}

export default CategoryService;
