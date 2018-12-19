export interface UserModel{
    email: string;
    password: string;
}

export class ProfileModel {
    name: string;
    lastName: string;
    dateBirth: string;
    avatar?: AvatarModel;
    key?: string;
    isAdmin?: boolean;
}

export class AvatarModel {
    url: string;
}