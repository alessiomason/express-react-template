import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import {EnvelopeAt, Lock, Person} from "react-bootstrap-icons";
import "./SignUpPage.css";
import logo from "../images/logos/logo.png";
import signUpApis from "../api/signUpApis";
import {checkValidEmail, checkValidPassword} from "../functions";

function SignUpPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleEmailCheck() {
        setInvalidEmail(false);

        // empty email is allowed
        if (email && !checkValidEmail(email)) {
            setInvalidEmail(true);
        }
    }

    function handlePasswordCheck() {
        setInvalidPassword(false);
        setShowPasswordRequirements(false);

        if (!checkValidPassword(password)) {
            setInvalidPassword(true);
            setShowPasswordRequirements(true);
        }
    }

    function doSignUp(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        handleEmailCheck();
        handlePasswordCheck();
        if (password !== confirmPassword) {
            setInvalidPassword(true);
            return
        }

        signUpApis.signUp(
            email,
            name,
            surname,
            username,
            password
        ).then(_res => {
            navigate("/successful-signup");
        }).catch(err => {
            setErrorMessage(err);
        })
    }

    return (
        <Container>
            <Row>
                <Col className="d-flex justify-content-center">
                    <img src={logo} alt="The logo of the application" className="login-logo"/>
                </Col>
            </Row>

            <Row className="mt-4">
                <Form>
                    <Row>
                        <Col>
                            <h2 className="text-center">Registrazione</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col/>
                        <Col sm={6}>

                                <SignUpPane
                                    email={email} setEmail={setEmail} invalidEmail={invalidEmail}
                                    handleEmailCheck={handleEmailCheck} name={name} setName={setName}
                                    surname={surname} setSurname={setSurname}
                                    username={username} setUsername={setUsername}
                                    password={password} setPassword={setPassword}
                                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                    invalidPassword={invalidPassword} handlePasswordCheck={handlePasswordCheck}
                                    showPasswordRequirements={showPasswordRequirements} errorMessage={errorMessage}/>
                        </Col>
                        <Col/>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Button type="submit" className="mb-5"
                                    onClick={ev => doSignUp(ev)}>Registrati</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
}

interface SignUpPaneProps {
    email: string
    setEmail: React.Dispatch<React.SetStateAction<string>>
    invalidEmail: boolean
    handleEmailCheck: () => void
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
    surname: string
    setSurname: React.Dispatch<React.SetStateAction<string>>
    username: string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    password: string
    setPassword: React.Dispatch<React.SetStateAction<string>>
    confirmPassword: string
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>
    invalidPassword: boolean
    showPasswordRequirements: boolean
    handlePasswordCheck: () => void
    errorMessage: string
}

function SignUpPane(props: SignUpPaneProps) {
    return (
        <>
            <Row>
                <Col>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><EnvelopeAt/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Email (richiesta al login)">
                            <Form.Control type="email" placeholder="Email (richiesta al login)" value={props.email}
                                          isInvalid={props.invalidEmail}
                                          onChange={ev => props.setEmail(ev.target.value)}
                                          onBlur={props.handleEmailCheck}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Name">
                            <Form.Control type="tel" placeholder="Name" value={props.name}
                                          onChange={ev => props.setName(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Surname">
                            <Form.Control type="text" placeholder="Surname" value={props.surname}
                                          onChange={ev => props.setSurname(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Username">
                            <Form.Control type="text" placeholder="Username" value={props.username}
                                          onChange={ev => props.setUsername(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>

                    <h6 className="mt-4">Scegli la password</h6>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Lock/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Password">
                            <Form.Control type="password" placeholder="Password" isInvalid={props.invalidPassword}
                                          value={props.password}
                                          onChange={ev => props.setPassword(ev.target.value)}
                                          onBlur={props.handlePasswordCheck}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Lock/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Conferma password">
                            <Form.Control type="password" placeholder="Conferma password"
                                          isInvalid={props.invalidPassword}
                                          value={props.confirmPassword}
                                          onChange={ev => props.setConfirmPassword(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>

                    {props.showPasswordRequirements &&
                        <p className="text-center mt-3 error">La password deve essere lunga almeno 8 caratteri, deve
                            contenere una lettera maiuscola, una lettera
                            minuscola e un numero.</p>}
                </Col>
            </Row>

            {props.errorMessage !== "" && <Row className="mt-2">
                <Col>
                    <h5 className="text-center error">{props.errorMessage}</h5>
                </Col>
            </Row>}
        </>
    )
        ;
}

export default SignUpPage;