export class User {
    id: number
    email: string
    name: string | undefined
    surname: string | undefined
    username: string | undefined
    registrationDate: string | undefined

    fullName() {
        return `${this.name} ${this.surname}`
    }

    constructor(
        id: number,
        email: string,
        name: string | undefined = undefined,
        surname: string | undefined = undefined,
        username: string | undefined = undefined,
        registrationDate: string | undefined
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.registrationDate = registrationDate;
    }
}