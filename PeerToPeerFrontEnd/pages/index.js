import React, { Component } from "react";
import factory from "../ethereum/factory";

import { Card,Button,Dropdown,Icon} from 'semantic-ui-react';

import Layout from "../components/Layout";
import {Link} from "../routes";
class PeerToPeerFrontEnd extends Component {

    static async getInitialProps(){
        //running in server
        const projects=await factory.methods.getDeployedProjects().call();

        return {projects};
    }
    constructor(props) {
        super(props);

        this.state = {
            user: "",
            bank: null
        };
        
    }

    renderProjects(){
        const items=this.props.projects.map(address=>{
            return{
                header:address,
                description:
                <Link route={`workcontract/${address}`}>
                    <a>View Work Contract</a>
                </Link>
                ,fluid: true
            };
        });
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout onUserChange={
                (user)=>{
                    this.setState({user});
                    //Console.log(`Index page chnage to ${user}`);
                }
            }>
                
                <div>
                    
                    <h3>Open projects</h3>
                    <Link route="workcontract/new">
                    <a>
                    <Button floated="right" icon="add circle" content="Create Work Contract" primary/>
                    </a>
                    </Link>
                    {this.renderProjects()}
                </div>
            </Layout>
        );
    }
}

export default PeerToPeerFrontEnd;
