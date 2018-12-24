import React, { Component } from "react";
import Layout from "../../../components/Layout";
import {Table, Button,TextArea,Input, Label}  from 'semantic-ui-react'; 
import {Link} from "../../../routes";
import workContractfunc from "../../../ethereum/project";

class WorkLogIndex extends Component{

    static async freshWorkLog(workContract){
        const numWorkLog= await workContract.methods.getWorkLogCount().call();
        const workLogs=await Promise.all(
            Array(parseInt(numWorkLog)).fill()
            .map(
                (element, index) => {
                    return workContract.methods.workLogs(numWorkLog-index-1).call();
                }
            )
        );
        return workLogs;
    }
    static async getInitialProps(props){
        const workContract =workContractfunc(props.query.address);
        const workLogs=await WorkLogIndex.freshWorkLog(workContract);
        
        return {
            address:props.query.address,
            workLogs
        };
    }

    constructor(props){
        super(props);
        this.state={
            address:this.props.address,
            workLogs:this.props.workLogs
        };
    }

    componentDidMount(){
        console.log(this.state.workLogs);
    }

    render(){
        const {Header, Row, HeaderCell, Body}=Table;
        return(
            <Layout>
                <h3>Work log</h3>
                <Label>Contract address: {this.props.address}</Label>

                <Table>
                <Header>
                    <Row>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>hiree Submit Date</HeaderCell>
                        <HeaderCell>hirer comment</HeaderCell>
                        <HeaderCell>Accept</HeaderCell>
                        <HeaderCell>Reject</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    
                </Body>
            </Table>
            </Layout>
        );

    }

}

export default WorkLogIndex;
