import {Button, Col, Row} from "react-bootstrap";
import {User} from "../models/user";
import {EnvelopeAt, Person} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

interface ProfilePageProps {
    readonly user: User
    readonly doLogout: () => void
}

function ProfilePage(props: ProfilePageProps) {
    const navigate = useNavigate();

    return (
        <>
            <Row>
                <h1 className="page-title">{`${props.user.name} ${props.user.surname}`}</h1>
            </Row>

            <Row>
                <Col/>
                <Col md={8}>
                    <Row>
                        <Col className="d-flex justify-content-end me-3">
                            <Button onClick={props.doLogout}>Esci</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Row className="d-flex align-items-center">
                            <Col sm={2}
                                 className="d-flex justify-content-center align-items-center">
                                <EnvelopeAt className="me-2"/>Email
                            </Col>
                            <Col>{props.user.email}</Col>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col sm={2}
                                 className="d-flex justify-content-center align-items-center">
                                <Person className="me-1"/>Username
                            </Col>
                            <Col>{props.user.username}</Col>
                        </Row>
                    </Row>
                </Col>
                <Col/>
            </Row>

            <Row className="mt-4">
                <Col/>
                <Col className="d-flex justify-content-center">
                    <Button onClick={() => {
                        navigate("/profile/edit")
                    }}>Modifica informazioni personali</Button>
                </Col>

                <Col className="d-flex justify-content-center">
                    <Button onClick={() => {
                        navigate("/profile/password")
                    }}>Modifica password</Button>
                </Col>
                <Col/>
            </Row>
        </>
    );
}

export default ProfilePage;