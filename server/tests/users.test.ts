import app from "../src/app";
import {agent as Request} from "supertest";
import {Tracker} from "knex-mock-client";
import {faker} from "@faker-js/faker";
import {NewUser, User} from "../src/users/user";
import {UserNotFound, UserWithSameUsernameError} from "../src/users/userErrors";
import * as crypto from "crypto";
import {clearTests, setupTests} from "./setupTests";
import dayjs = require("dayjs");

jest.mock("../src/database/db", () => {
    const Knex = require("knex");
    const {MockClient} = require("knex-mock-client");
    return {
        knex: Knex({client: MockClient}),
    };
});

describe("Test users APIs", () => {
    const baseURL = "/api/users";
    let tracker: Tracker;
    let session = "";

    const email = faker.internet.email();
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const username = `${name} ${surname}`;
    const user = new User(
        faker.number.int(),
        email,
        name,
        surname,
        username,
        undefined,
        undefined,
        undefined
    );
    const otherUser = new User(
        faker.number.int(),
        faker.internet.email(),
        faker.person.firstName(),
        faker.person.lastName(),
        faker.person.firstName(),
        undefined,
        undefined,
        undefined
    );
    const newUser = new NewUser(
        email,
        name,
        surname,
        username
    );

    beforeAll(async () => {
        const setupResult = await setupTests();
        tracker = setupResult.tracker;
        session = setupResult.session;
    });

    afterEach(() => {
        clearTests(tracker);
    });

    test("Get all users empty list", async () => {
        tracker.on.select("users").response([]);

        const res = await new Request(app).get(baseURL).set("Cookie", session);
        expect(res.body).toEqual([]);
    })

    test("Get all users", async () => {
        tracker.on.select("users").response([user]);

        const res = await new Request(app).get(baseURL).set("Cookie", session);
        expect(res.body).toEqual([user]);
    })

    test("Get single user", async () => {
        tracker.on.select("users").response(user);

        const res = await new Request(app).get(`${baseURL}/${user.id}`).set("Cookie", session);
        expect(res.body).toEqual(user);
    })

    test("Get single user not found", async () => {
        tracker.on.select("users").response(undefined);

        const res = await new Request(app).get(`${baseURL}/${faker.number.int()}`).set("Cookie", session);

        const expectedError = new UserNotFound();
        expect(res.statusCode).toBe(expectedError.statusCode);
        expect(res.body).toEqual(expectedError);
    })

    test("Update user", async () => {
        tracker.on.select("users").responseOnce(otherUser);
        tracker.on.select("users").responseOnce(undefined);
        tracker.on.update("users").response(null);

        const res = await new Request(app).put(baseURL).send(newUser).set("Cookie", session);
        expect(res.statusCode).toBe(200);
    })

    test("Update user not found", async () => {
        tracker.on.select("users").response(undefined);

        const res = await new Request(app).put(baseURL).send(newUser).set("Cookie", session);

        const expectedError = new UserNotFound();
        expect(res.statusCode).toBe(expectedError.statusCode);
        expect(res.body).toEqual(expectedError);
    })

    test("Update user username already exists", async () => {
        tracker.on.select("users").responseOnce(otherUser);
        tracker.on.select("users").responseOnce(newUser);

        const res = await new Request(app).put(baseURL).send(newUser).set("Cookie", session);

        const expectedError = new UserWithSameUsernameError();
        expect(res.statusCode).toBe(expectedError.statusCode);
        expect(res.body).toEqual(expectedError);
    })
})
