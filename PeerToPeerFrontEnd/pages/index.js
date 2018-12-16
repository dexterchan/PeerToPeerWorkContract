import React, { Component } from "react";
import { Dropdown} from 'semantic-ui-react';
import CreateCashOrder from "../components/CreateCashOrder";
import Layout from "../components/Layout";
class PeerToPeerFrontEnd extends Component {

    userOptions = [
        {
            text: 'hirer',
            value: 'hirer'
        },
        {
            text: 'hiree',
            value: 'hiree'
        }
    ]
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
                <Dropdown placeholder='Select user' fluid selection options={this.userOptions} value={this.state.user} />
                <CreateCashOrder user={this.state.user}/>
            </Layout>
        );
    }
}

export default PeerToPeerFrontEnd;
