import { AuthenticationType } from "./authentication-type.enum";

export interface Action {
    id?: number,
    name?: string,
    subName?: string,
    description?: string,
    registrationStart?: Date,
    registrationEnd?: Date,
    actionStart?: Date,
    actionEnd?: Date,
    maxUsers?: number,
    freeSpace?: number,
    hidden?: boolean,
    authenticationType?: AuthenticationType
}
