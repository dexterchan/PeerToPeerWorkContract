import React, { Component } from "react";
import { Dropdown,Icon} from 'semantic-ui-react';
import CreateCashOrder from "../components/CreateCashOrder";
import Layout from "../components/Layout";
import {Link} from "../routes";
class PeerToPeerFrontEnd extends Component {

    
    constructor(props) {
        super(props);

        this.state = {
            user: "hirer",
            bank: null
        };
    }
    render() {
        return (
            <Layout>
                <Link route="/projects/new">
                    <a className="item"><Icon disabled name='add circle' /></a>
                </Link>
                
            </Layout>
        );
    }
}

export default PeerToPeerFrontEnd;
