import { AvatarModel } from "./user";

export class GroupModel {
    name: string;
    description: string;
    admins: string[];
    key?: string;
    search?: string;
    armies: string[];
    otherArmies: string[];
    avatar?: AvatarModel;
}