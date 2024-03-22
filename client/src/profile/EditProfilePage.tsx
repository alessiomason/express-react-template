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

    function handleEmailCheck() {
        setInvalidEmail(false);

        // empty email is allowed
        if (email && !checkValidEmail(email)) {
            setInvalidEmail(true);
        }
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        handleEmailCheck();

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
                    <InputGroup className="padded-form-input">
                        <InputGroup.Text><Person/></InputGroup.Text>
                        <FloatingLabel controlId="floatingInput" label="Username">
                            <Form.Control type="text" placeholder="Username" value={username}
                                          onChange={ev => setUsername(ev.target.value)}/>
                        </FloatingLabel>
                    </InputGroup>
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