export class User {
    private _userId: string;
    private _username: string;
    private _email: string;
    private _firstname: string;
    private _lastname: string;
    private _roles: string[];

    constructor(userId: string, username: string, email: string, firstname: string, lastname: string, roles: string[]){
        this._userId = userId;
        this._username = username;
        this._email = email;
        this._firstname = firstname;
        this._lastname = lastname;
        this._roles = roles;
    }

    public get fullname(): string{
        return `${this._firstname} ${this._lastname}`;
    }

    public get firstname(): string{
        return this._firstname;
    }

    public get lastname(): string{
        return this._lastname;
    }

    public get email(): string{
        return this._email;
    }

    public get userId(): string{
        return this._userId;
    }

    public get roles(): string[]{
        return this._roles;
    }

    public hasRole(role: string): boolean{
        console.log(this._roles);
        return this._roles.includes(role);
    }

    public hasRoles(roles: string): boolean{
        for(let role of roles){
            if(!this.hasRole(role))
                return false;
        }
        return true;
    }
}