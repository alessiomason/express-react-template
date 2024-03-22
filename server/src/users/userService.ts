import {knex} from "../database/db";
import {NewUser, User} from "./user";
import {UserNotFound, UserWithSameUsernameError} from "./userErrors";

export async function getAllUsers() {
    const users = await knex("users").select();

    return users.map(user => {
        return new User(
            user.id,
            user.email,
            user.name,
            user.surname,
            user.username,
            undefined,
            undefined,
            user.registrationDate
        );
    });
}

export async function getUser(id: number) {
    const user = await knex("users")
        .first()
        .where({id: id});

    if (!user) return

    return new User(
        user.id,
        user.email,
        user.name,
        user.surname,
        user.username,
        undefined,
        undefined,
        user.registrationDate
    )
}

export async function getFullUser(id: number) {
    const user = await knex<User>("users")
        .first()
        .where({id: id});

    if (!user) return

    return new User(
        user.id,
        user.email,
        user.name,
        user.surname,
        user.username,
        user.hashedPassword,
        user.salt,
        user.registrationDate
    )
}

export async function getUserFromEmail(email: string) {
    const user = await knex<User>("users")
        .first()
        .where({email: email});

    if (!user) return

    return new User(
        user.id,
        user.email,
        user.name,
        user.surname,
        user.username,
        user.hashedPassword,
        user.salt,
        user.registrationDate
    );
}

export async function usernameAlreadyExists(username: string) {
    const user = await knex<User>("users")
        .first()
        .where({username: username});

    return user !== undefined
}

export async function createUser(newUser: NewUser) {
    if (newUser.username !== undefined && await usernameAlreadyExists(newUser.username)) {
        throw new UserWithSameUsernameError();
    }

    const userIds = await knex("users")
        .returning("id")
        .insert(newUser);

    return new User(
        userIds[0],
        newUser.email,
        newUser.name,
        newUser.surname,
        newUser.username,
        undefined,
        undefined,
        undefined
    )
}

export async function saveUserPassword(userId: number, hashedPassword: Buffer, salt: Buffer) {
    await knex("users")
        .where({id: userId})
        .update({
            hashedPassword: hashedPassword,
            salt: salt
        });
}

// `undefined` values are skipped, not updated
export async function updateUser(
    id: number,
    email: string | undefined,
    name: string | undefined,
    surname: string | undefined,
    username: string | undefined
) {
    const user = await getUser(id);
    if (!user) {
        throw new UserNotFound();
    }

    if (username !== undefined && username !== user.username && await usernameAlreadyExists(username)) {
        throw new UserWithSameUsernameError();
    }

    // check that at least one field is changing to avoid a faulty query
    if (email !== undefined || name !== undefined || surname !== undefined || username !== undefined) {
        await knex("users")
            .where("id", user.id)
            .update({
                email: email,
                name: name,
                surname: surname,
                username: username
            });
    }
}