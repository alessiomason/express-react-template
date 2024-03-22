import logo from "../images/logos/logo.png";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import React from "react";

function SuccessfulSignUpPage() {
    const navigate = useNavigate();

    return (
        <Container>
            <Row>
                <Col className="d-flex justify-content-center">
                    <img src={logo} alt="The logo of the application" className="login-logo"/>
                </Col>
            </Row>

            <Row>
                <Col/>
                <Col sm={6}>
                    <Row>
                        <Col>
                            <h2 className="text-center">Registrazione avvenuta con successo</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <p className="text-center">La registrazione è avvenuta con successo! Puoi ora procedere al
                                login.</p>
                        </Col>
                    </Row>
                </Col>
                <Col/>
            </Row>

            <Row className="mt-2">
                <Col className="d-flex justify-content-center">
                    <Button className="glossy-button" onClick={() => navigate("/login")}>Login</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default SuccessfulSignUpPage;