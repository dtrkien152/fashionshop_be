import {inject, injectable} from "tsyringe";
import {UserService} from "../services";
import {Request, Response} from "express";
import {ObjectUtils} from "../utils";

@injectable()
class UserController {
    constructor(@inject(UserService) private userService: UserService) {
    }

    getUserProfile = async (req: Request, res: Response): Promise<any> => {
        try {
            const session = req.session;
            if (!session || !session['userId']) {
                return res.status(400).json({message: "Phiên đăng nhập hết hạn"});
            }
            const user = await this.userService.getById(session['userId']);
            const bodyResponse = ObjectUtils.convertAllowFields(user, ["id", "email", "full_name", "gender", "phone", "avatar", "is_active"]);
            res.send({data: bodyResponse});

        } catch (error) {
            return res.status(500).json({message: "Lỗi server", error: error.message});
        }

    }

    updateProfile = async (req: Request, res: Response) => {
        await this.userService.updateUserProfile(req.session['userId'], req.body);
        res.status(200).send("Moderator Content.");
    };
}

export default UserController;
