import {useNavigate} from "react-router-dom";
import {Button, Col, Navbar, Row} from "react-bootstrap";
import "./MyNavbar.css";
import logo from "../images/logos/logo.png";
import {User} from "../models/user";
import React from "react";

interface NavbarProps {
    readonly user: User
}

function MyNavbar(props: NavbarProps) {
    const navigate = useNavigate();

    return (
        <Navbar className="navbar fixed-top navbar-padding">
            <Row className="navbar-row">
                <Col>
                    <Navbar.Brand className="text" onClick={() => navigate("/")}>
                        <img src={logo} className="brand-image" alt="Logo di Technomake"/>
                    </Navbar.Brand>
                </Col>

                <Col className="d-flex justify-content-end align-items-center">
                    <Button className="me-3" onClick={() => navigate("/profile")}>
                        {`${props.user.name} ${props.user.surname}`}
                    </Button>
                </Col>
            </Row>
        </Navbar>
    );
}

export default MyNavbar;