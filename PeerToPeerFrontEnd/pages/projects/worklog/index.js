import React, { Component } from "react";
import Layout from "../../../components/Layout";
import {Table, Button,TextArea,Input}  from 'semantic-ui-react'; 
import {Link} from "../../../routes";
import workContractfunc from "../../../ethereum/project";

class WorkLogIndex extends Component{

    static async freshWorkLog(workContract){
        const numWorkLog= await workContract.methods.getEvidenceCount().call();
        const workLogs=await Promise.all(
            Array(parseInt(numWorkLog)).fill()
            .map(
                (element, index) => {
                    return numWorkLog.methods.requests(index).call();
                }
            )
        );
    }
    static async getInitialProps(props){
        const workContract =workContractfunc(props.query.address);
        
        
        return {
            address:props.query.address
        };
    }

    constructor(props){
        super(props);
        
    }

    render(){
        return(
            <h3>{this.props.address}:Work log</h3>

        );

    }

}

export default WorkLogIndex;
