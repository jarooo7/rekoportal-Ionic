export interface UserModel{
    email: string;
    password: string;
}

export interface RegisterModel{
    email: string;
    password: string;
    name: string;
    lastName: string;
}

export class ProfileModel {
    name: string;
    lastName: string;
    avatar?: AvatarModel;
    key?: string;
    isAdmin?: boolean;
    search?: string;
    platform?: string;
}

export class AvatarModel {
    url: string;
}