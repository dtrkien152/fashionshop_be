import UserService from "../services/userService.js";

export async function getUserProfile(req, res) {
    try {
        const session = req.session;
        if (!session || !session.user) {
            return res.status(400).json({message: "Phiên đăng nhập hết hạn"});
        }
        const user = await UserService.UserInforByID(session.user.id);
        res.send({ user });

    } catch (error) {
        return res.status(500).json({message: "Lỗi server", error: error.message});
    }

}


export const updateProfile = (req, res) => {
    UserService.updateUserProfile(req.session.user.id,req.body);
    res.status(200).send("Moderator Content.");
};
