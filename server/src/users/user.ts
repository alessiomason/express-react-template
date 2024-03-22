export class NewUser {
    email: string
    name: string | undefined
    surname: string | undefined
    username: string | undefined

    fullName() {
        return `${this.name} ${this.surname}`
    }

    constructor(
        email: string,
        name: string | undefined = undefined,
        surname: string | undefined = undefined,
        username: string | undefined = undefined
    ) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.username = username;
    }
}

export class User extends NewUser {
    id: number
    hashedPassword: Buffer | undefined
    salt: Buffer | undefined
    registrationDate: string | undefined

    constructor(
        id: number,
        email: string,
        name: string | undefined = undefined,
        surname: string | undefined = undefined,
        username: string | undefined = undefined,
        hashedPassword: Buffer | undefined,
        salt: Buffer | undefined,
        registrationDate: string | undefined
    ) {
        super(
            email,
            name,
            surname,
            username,
        );
        this.id = id;
        this.hashedPassword = hashedPassword;
        this.salt = salt;
        this.registrationDate = registrationDate;
    }
}