import {Button, Col, Container, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import React, {useState} from "react";
import "./LoginPage.css";
import logo from "../images/logos/logo.png";
import {Lock, Person} from "react-bootstrap-icons";
import {Credentials} from "../models/credentials";
import {checkValidEmail} from "../functions";

function LoginPage(props: any) {
    const [email, setEmail] = useState("alessio.mason@me.com");
    const [password, setPassword] = useState("password");
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);

    function checkEmail() {
        const valid = checkValidEmail(email);
        setInvalidEmail(!valid);
        return valid;
    }

    function handleLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        if (!checkEmail()) return

        setInvalidPassword(false);
        if (password === "") {
            setInvalidPassword(true);
            return
        }

        const credentials = new Credentials(email, password);
        props.doLogin(credentials);
    }

    return (
        <Container className="login-container">
            <Row>
                <Col className="d-flex justify-content-center">
                    <img src={logo} alt="The logo of the application" className="login-logo"/>
                </Col>
            </Row>

            <Row>
                <Form className="login-form d-flex flex-column justify-content-center">
                    <Row>
                        <Col>
                            <h2 className="text-center">Login</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col/>
                        <Col sm={6}>
                            <Row>
                                <Col>
                                    <InputGroup className="padded-form-input">
                                        <InputGroup.Text><Person/></InputGroup.Text>
                                        <FloatingLabel controlId="floatingInput" label="Email">
                                            <Form.Control type="email" placeholder="Email" isInvalid={invalidEmail}
                                                          value={email} onBlur={checkEmail}
                                                          onChange={ev => setEmail(ev.target.value)}/>
                                        </FloatingLabel>
                                    </InputGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <InputGroup className="padded-form-input">
                                        <InputGroup.Text><Lock/></InputGroup.Text>
                                        <FloatingLabel controlId="floatingInput" label="Password">
                                            <Form.Control type="password" placeholder="Password"
                                                          isInvalid={invalidPassword} value={password}
                                                          onChange={ev => setPassword(ev.target.value)}/>
                                        </FloatingLabel>
                                    </InputGroup>
                                </Col>
                            </Row>

                            {props.message !== "" && <Row>
                                <Col>
                                    <h5 className="text-center error mt-3">{props.message}</h5>
                                </Col>
                            </Row>}
                        </Col>
                        <Col/>
                    </Row>

                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Button type="submit" onClick={ev => handleLogin(ev)}>Login</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    );
}

export default LoginPage;