import {Button, Col, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import {User} from "../models/user";
import {CarFront, EnvelopeAt, Floppy, Person, Telephone} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import userApis from "../api/userApis";
import {checkValidEmail} from "../functions";

interface EditProfilePageProps {
    readonly user: User
    readonly setDirtyUser: React.Dispatch<React.SetStateAction<boolean>>
}

function EditProfilePage(props: EditProfilePageProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState(props.user.email);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [name, setName] = useState(props.user.name ?? "");
    const [surname, setSurname] = useState(props.user.surname ?? "");
    const [username, setUsername] = useState(props.user.username ?? "");
    const [verifiedUsername, setVerifiedUsername] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);

    function handleEmailCheck() {
        setInvalidEmail(false);

        // empty email is allowed
        if (email && !checkValidEmail(email)) {
            setInvalidEmail(true);
        }
    }

    function handleUsernameCheck() {
        if (username === "" || username === props.user.username) {
            setVerifiedUsername(false);
            setInvalidUsername(false);
        } else {
            userApis.verifyUsernameUniqueness(username)
                .then(unique => {
                    setVerifiedUsername(true);
                    setInvalidUsername(!unique);
                })
                .catch(err => console.error(err))
        }
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        handleEmailCheck();
        if (verifiedUsername && invalidUsername) {  // username can be null
            return
        }

        const user = new User(
            props.user.id,
            email,
            name,
            surname,
            username,
            props.user.registrationDate
        );

        userApis.updateUser(user)
            .then(() => {
                props.setDirtyUser(true);
                navigate("/profile");
            })
            .catch(err => console.error(err))
    }

    return (
        <Form>
            <Row>
                <h1 className="page-title">Modifica le informazioni personali</h1>
            </Row>
            <Row>
                <Col/>
                <Col md={8}>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><EnvelopeAt/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Email">
                            <Form.Control type="email" placeholder="Email" value={email} isInvalid={invalidEmail}
                                          onChange={ev => setEmail(ev.target.value)}
                                          onBlur={handleEmailCheck}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Name">
                            <Form.Control type="tel" placeholder="Name" value={name}
                                          onChange={ev => setName(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Surname">
                            <Form.Control type="text" placeholder="Surname" value={surname}
                                          onChange={ev => setSurname(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup hasValidation className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Username">
                            <Form.Control type="text" placeholder="Username" value={username}
                                          isValid={verifiedUsername && !invalidUsername}
                                          isInvalid={verifiedUsername && invalidUsername}
                                          onChange={ev => setUsername(ev.target.value)}
                                          onBlur={handleUsernameCheck}/>
                            <Form.Control.Feedback type="invalid" tooltip>Username already
                                exists!</Form.Control.Feedback>
                        </FloatingLabel>
                    </InputGroup>
                    <p>veri {verifiedUsername ? 1 : 0}</p>
                    <p>inva {invalidUsername ? 1 : 0}</p>
                </Col>
                <Col/>
            </Row>

            <Row className="d-flex justify-content-center mt-4">
                <Col md={4} className="d-flex justify-content-center">
                    <Button type="submit" onClick={handleSubmit}>Salva</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default EditProfilePage;