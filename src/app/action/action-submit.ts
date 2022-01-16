import { PublicUser } from "./public-uer";

export interface ActionSubmit {
    id?: number,
    publicUser: PublicUser,
    legacyAccessToken?: string
}
