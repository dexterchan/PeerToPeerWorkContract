import React, { Component } from "react";
import factory from "../ethereum/factory";

import { Card,Button,Dropdown,Icon} from 'semantic-ui-react';

import Layout from "../components/Layout";
import {Link} from "../routes";

import web3 from '../ethereum/web3_query';
import workContractfunc from "../ethereum/project";

class PeerToPeerFrontEnd extends Component {

    static async getInitialProps(){
        //running in server
        const projects=await factory.methods.getDeployedProjects().call();
        
        const briefProjects=await Promise.all ( projects.map(async address=>{
            const workContract =workContractfunc(address);
            const hirer=await workContract.methods.hirer().call();
            const hirerName=await workContract.methods.getMemberName(hirer).call();
            return{
                address,
                hirerName
            };
        }));
        return {projects,briefProjects};
    }
    constructor(props) {
        super(props);

        this.state = {
            user: "",
            bank: null
        };
        
    }

    renderProjects(){
        
        const items=this.props.briefProjects.map(prj=>{
            return{
                header:prj.address,
                meta:"Raised by "+prj.hirerName,
                description:
                <Link route={`workcontract/${prj.address}`}>
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
