import {Express, Request, Response} from "express";
import {RequestHandler} from "express-serve-static-core";
import {ParameterError} from "../errors";
import {
    getAllUsers,
    getUser,
    updateUser,
    usernameAlreadyExists
} from "./userService";
import {body, param, validationResult} from "express-validator";
import {UserNotFound, UserWithSameUsernameError} from "./userErrors";
import {User} from "./user";
import {handleException} from "../functions";

export function useUsersAPIs(app: Express, isLoggedIn: RequestHandler) {
    const baseURL = "/api/users";

    // get all users
    app.get(baseURL, isLoggedIn, async (_: Request, res: Response) => {
        try {
            const users = await getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            handleException(err, res);
        }
    })

    // get user by id
    app.get(`${baseURL}/:userId`,
        isLoggedIn,
        param("userId").isInt({min: 1}),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(ParameterError.code).json(new ParameterError("The id of the user must be an integer number!"));
                return
            }

            try {
                const userId = parseInt(req.params.userId);
                const user = await getUser(userId);

                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(UserNotFound.code).json(new UserNotFound());
                }
            } catch (err) {
                handleException(err, res);
            }
        }
    )

    // verify unique username
    app.get(`${baseURL}/username/:username`,
        param("username").isString(),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(ParameterError.code).json(new ParameterError("The username must be a string!"));
                return
            }

            if (await usernameAlreadyExists(req.params.username)) {
                res.status(UserWithSameUsernameError.code).json(new UserWithSameUsernameError());
            } else {
                res.status(200).end();
            }
        }
    )

    // update user
    app.put(baseURL,
        isLoggedIn,
        body("email").optional({values: "null"}).isEmail(),
        body("name").optional({values: "null"}).isString(),
        body("surname").optional({values: "null"}).isString(),
        body("username").optional({values: "null"}).isString(),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(ParameterError.code).json(new ParameterError("There was an error with the parameters!"))
                return
            }

            const userId = (req.user as User).id;
            try {
                await updateUser(
                    userId,
                    req.body.email,
                    req.body.name,
                    req.body.surname,
                    req.body.username
                );

                res.status(200).end();
            } catch (err) {
                handleException(err, res);
            }
        }
    )
}