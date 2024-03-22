import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
import {MockStrategy, setupSerializeAndDeserialize} from "passport-mock-strategy";
import * as crypto from "crypto";
import {getUser, getUserFromEmail} from "../users/userService";

export function setupPassport() {
    // mock authentication strategy (for testing)
    if (process.env.NODE_ENV === "test") {
        passport.use(new MockStrategy());
        setupSerializeAndDeserialize(passport);
        return
    }

    // real authentication strategies

    passport.use(new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async function (email: string, password: string, done: any) {
            const user = await getUserFromEmail(email);

            if (!user) {
                return done(null, false, "Email o password non corretti.");
            }

            if (!user.salt) {
                return done(null, false, "Email o password non corretti.");
            }

            crypto.pbkdf2(password, user.salt, 31000, 32, "sha256", function (err, hashedPassword) {
                if (err) return (done(err));

                if (!user.hashedPassword) {
                    return done(null, false, "Email o password non corretti.");
                }

                if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword)) {
                    return done(null, false, "Email o password non corretti.");
                }

                // do not send these fields to the client
                user.hashedPassword = undefined;
                user.salt = undefined;

                return done(null, user);
            })
        }
    ));

    // serialize and de-serialize the user (user object <-> session)
    // we serialize the user id, and we store it in the session: the session is very small in this way
    passport.serializeUser((user, done) => {
        // @ts-ignore
        done(null, user.id);
    });

    // starting from the data in the session, we extract the current (logged-in) user
    passport.deserializeUser(async (id: number, done) => {
        const user = await getUser(id);
        done(null, user);
    });
}