import passport from "passport";
import {Express, Request, Response} from "express";
import {createUser, getFullUser, saveUserPassword} from "../users/userService";
import * as crypto from "crypto";
import {RequestHandler} from "express-serve-static-core";
import {body, validationResult} from "express-validator";
import {BaseError, ParameterError} from "../errors";
import {NewUser, User} from "../users/user";
import {handleException} from "../functions";
import {UserNotFound} from "../users/userErrors";

export function useAuthenticationAPIs(app: Express, isLoggedIn: RequestHandler) {
    // mock authentication endpoint (for testing)
    if (process.env.NODE_ENV === "test") {
        app.get("/auth/mock",
            passport.authenticate("mock"),
            function (req: Request, res: Response) {
                const prevSession = req.session;
                req.session.regenerate((_err) => {
                    Object.assign(req.session, prevSession);
                    res.json({
                        loggedIn: true,
                        user: req.user
                    });
                });
            },
            function (_err: any, _req: Request, res: Response) {
                res.json({loggedIn: false});
            }
        );

        return
    }

    // real authentication endpoints

    // login
    app.post("/api/sessions", function (req, res, next) {
        passport.authenticate("local", (err: any, user: User, info: string) => {
            if (err) return next(err);
            if (!user) {
                // display wrong login messages
                return res.status(401).json(info);
            }

            // success, perform the login
            req.login(user, (err) => {
                if (err) return next(err);

                // req.user contains the authenticated user, we send all the user info back
                const prevSession = req.session;
                req.session.regenerate((_err) => {
                    Object.assign(req.session, prevSession);
                    res.json({
                        loggedIn: true,
                        user: req.user
                    });
                });
            });
        })(req, res, next);
    });

    // logout
    app.delete("/api/sessions/current", isLoggedIn, (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
            } else {
                res.status(200).end();
            }
        });
        /*req.logout(err => {
            if (err) {
                console.error(err);
            } else {
                res.status(200).end();
            }
        });*/
    });

    // check whether the user is logged in or not
    app.get("/api/sessions/current", (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).json(req.user);
        } else
            res.status(401).json({error: "Non-authenticated user!"});
    });

    // sign up
    app.post("/api/signup",
        body("email").isEmail(),
        body("name").optional({values: "null"}).isString(),
        body("surname").optional({values: "null"}).isString(),
        body("username").optional({values: "null"}).isString(),
        body("password").isString(),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty() || !req.params) {
                res.status(ParameterError.code).json(new ParameterError("There was an error with the body values!"));
                return
            }

            // create
            const newUser = new NewUser(
                req.body.email,
                req.body.name,
                req.body.surname,
                req.body.username
            );

            try {
                const user = await createUser(newUser);

                const salt = crypto.randomBytes(16);
                crypto.pbkdf2(req.body.password, salt, 31000, 32, "sha256", function (err, hashedPassword) {
                    if (err) throw err;
                    saveUserPassword(user.id, hashedPassword, salt);
                    res.status(200).end();
                })
            } catch (err) {
                handleException(err, res);
            }
        });

    // update password
    app.put("api/password",
        isLoggedIn,
        body("oldPassword").isString(),
        body("newPassword").isString(),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty() || !req.params) {
                res.status(ParameterError.code).json(new ParameterError("There was an error wth the body values!"))
                return
            }

            const userId = (req.user as User).id;
            const user = await getFullUser(userId);

            if (!user) {
                res.status(UserNotFound.code).json(new UserNotFound());
                return
            }

            crypto.pbkdf2(req.body.oldPassword, user.salt!, 31000, 32, "sha256", function (err, hashedPassword) {
                if (err) throw err;

                if (!crypto.timingSafeEqual(user.hashedPassword!, hashedPassword)) {
                    res.status(422).json(new BaseError(422, "La vecchia password è errata!"));
                    return
                }

                const salt = crypto.randomBytes(16);
                crypto.pbkdf2(req.body.newPassword, salt, 31000, 32, "sha256", function (err, hashedPassword) {
                    if (err) throw err;
                    saveUserPassword(userId, hashedPassword, salt);
                    res.status(200).end();
                })
            })
        }
    )
}