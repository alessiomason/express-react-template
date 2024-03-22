import {Button, Col, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import {Lock, LockFill} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {checkValidPassword} from "../functions";
import signUpApis from "../api/signUpApis";

function EditPasswordPage() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

    function handlePasswordCheck() {
        setInvalidPassword(false);
        setShowPasswordRequirements(false);

        if (!checkValidPassword(password)) {
            setInvalidPassword(true);
            setShowPasswordRequirements(true);
        }
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        handlePasswordCheck();
        if (password !== confirmPassword) {
            setInvalidPassword(true);
            return
        }

        if (oldPassword === "") return

        signUpApis.updatePassword(oldPassword, password)
            .then(_ => navigate("/profile"))
            .catch(err => console.error(err))
    }

    return (
        <Form>
            <Row>
                <h1 className="page-title">Modifica la password</h1>
            </Row>

            <Row>
                <Col/>
                <Col md={8}>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Lock/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Vecchia password">
                            <Form.Control type="password" placeholder="Vecchia password" value={oldPassword}
                                          onChange={ev => setOldPassword(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><LockFill/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Nuova password">
                            <Form.Control type="password" placeholder="Nuova password" isInvalid={invalidPassword}
                                          value={password}
                                          onChange={ev => setPassword(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><LockFill/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Conferma nuova password">
                            <Form.Control type="password" placeholder="Conferma nuova password"
                                          isInvalid={invalidPassword}
                                          value={confirmPassword}
                                          onChange={ev => setConfirmPassword(ev.target.value)}
                                          onBlur={handlePasswordCheck}/>
                        </FloatingLabel>
                    </InputGroup>

                    {showPasswordRequirements &&
                        <p className="text-center mt-3 error">La password deve essere lunga almeno 8 caratteri, deve
                            contenere una lettera maiuscola, una lettera
                            minuscola e un numero.</p>}
                </Col>
                <Col/>
            </Row>

            <Row className="d-flex justify-content-center mt-4">
                <Col md={4} className="d-flex justify-content-center">
                    <Button type="submit" onClick={handleSubmit}>Cambia password</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default EditPasswordPage;