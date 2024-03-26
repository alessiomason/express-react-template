import "bootstrap/dist/css/bootstrap.min.css";
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import PageLayout from "./PageLayout";
import LoginPage from "./login/LoginPage";
import loginApis from "./api/loginApis";
import "./App.css";
import SignUpPage from "./signup/SignUpPage";
import SuccessfulSignUpPage from "./signup/SuccessfulSignUpPage";
import {User} from "./models/user";
import ProfilePage from "./profile/ProfilePage";
import EditProfilePage from "./profile/EditProfilePage";
import {Credentials} from "./models/credentials";
import userApis from "./api/userApis";
import EditPasswordPage from "./profile/EditPasswordPage";
import HomePage from "./home/HomePage";

function App() {
    return (
        <Router>
            <App2/>
        </Router>
    );
}

function App2() {
    // user is initially read from local storage to maintain login state between page refreshes,
    // but is then always checked by the checkAuth() function (that checks with the server)
    const initialUserJson = window.localStorage.getItem("user");
    const initialUser = initialUserJson ? JSON.parse(initialUserJson) as User : undefined;
    const [user, setUser] = useState(initialUser);
    const [dirtyUser, setDirtyUser] = useState(false);
    const loggedIn = user !== undefined;
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn && dirtyUser) {
            userApis.getUser(user!.id)
                .then(user => {
                    setUser(user);
                    setDirtyUser(false);
                })
                .catch(err => console.error(err))
        }
    }, [dirtyUser]);

    useEffect(() => {
        if (user) {
            window.localStorage.setItem("user", JSON.stringify(user));
        } else {
            window.localStorage.removeItem("user");
        }
    }, [user]);

    // run once, at app load
    useEffect(() => {
        // check if already logged in
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const user = await loginApis.getUserInfo();
            setUser(user);
        } catch (_err) {
            // do not log it, otherwise error logged before every login
        }
    }

    function doLogin(credentials: Credentials) {
        loginApis.login(credentials)
            .then(user => {
                setUser(user);
                setMessage("");
                navigate("/");
            })
            .catch(err => {
                console.log(err)
                setMessage(err);
            })
    }

    function doLogout() {
        loginApis.logout()
            .then(() => {
                setUser(undefined);
                setMessage("");
                navigate("/login");
            })
            .catch(err => console.error(err))
    }

    return (
        <Routes>
            <Route path="/login" element={loggedIn ? <Navigate to="/"/> :
                <LoginPage loggedIn={loggedIn} doLogin={doLogin} user={user} message={message}/>}/>
            <Route path="/signup" element={loggedIn ? <Navigate to="/"/> : <SignUpPage/>}/>
            <Route path="/successful-signup" element={loggedIn ? <Navigate to="/"/> : <SuccessfulSignUpPage/>}/>
            <Route path="/" element={loggedIn ? <PageLayout user={user!}/> : <Navigate to="/login"/>}>
                <Route index element={<HomePage/>}/>
                <Route path="profile" element={<ProfilePage user={user!} doLogout={doLogout}/>}/>
                <Route path="profile/edit" element={<EditProfilePage user={user!} setDirtyUser={setDirtyUser}/>}/>
                <Route path="profile/password" element={<EditPasswordPage/>}/>
            </Route>
        </Routes>
    );
}

export default App;
