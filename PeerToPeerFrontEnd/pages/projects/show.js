import React,{Component} from 'react';
import Layout from '../../components/Layout';
import projectfunc from "../../ethereum/project";
import {Card,Grid, Button}  from 'semantic-ui-react'; 
import web3 from '../../ethereum/web3_query';
import {Link} from '../../routes';

const StatusMap = require("../../ethereum/WorkContractStatus");

class WorkContractShow extends Component{
    //running in server
        
    static async getInitialProps(props){
        const workContract =projectfunc(props.query.address);
        const summary={};

        const statusNum=await workContract.methods.myStatus().call();
        
        summary["hirer"]=await workContract.methods.hirer().call();
        summary["hirerName"]=await workContract.methods.getMemberName(summary["hirer"]).call();
        summary["hiree"] = await workContract.methods.hiree().call();
        if(summary["hiree"]=="0x0000000000000000000000000000000000000000"){
            summary["hireeName"]="";
        }else{
            summary["hireeName"]=await workContract.methods.getMemberName(summary["hiree"]).call();
        }
        
        summary["task_description"] = await workContract.methods.task_description().call();
        summary["reward"]=await workContract.methods.reward().call();
        summary["duration"]=await workContract.methods.duration().call();
        summary["creationDate"]=new Date(await workContract.methods.creationDate().call() *1000).toLocaleDateString();
        summary["executionDate"]=new Date(await workContract.methods.executionDate().call() *1000);
        
        return {
            address:props.query.address,
            myStatus:StatusMap[statusNum],
            summary
        };
    }
    constructor(props){
        super(props);
        
    }

    renderCards(){
        const{
            hirer,
            hirerName,
            hiree,
            hireeName,
            task_description,
            reward,
            duration,
            creationDate,
            executionDate
        }=this.props.summary;
        const items=[
            {
                header:hirer+":("+hirerName+")",
                meta:"hirer of this contract",
                description:"Hirer created this contract",
                style: {overflowWrap:'break-word'}
            },
            {
                header:task_description,
                meta:"Task Description",
                description:"Hirer described the task",
                style: {overflowWrap:'break-word'}
            },
            {
                header:reward,
                meta:"Reward of this task",
                description:"Hiree will get this reward",
                style: {overflowWrap:'break-word'}
            },
            {
                header:duration,
                meta:"Expected duration of task",
                description:"Time to finish",
                style: {overflowWrap:'break-word'}
            },
            {
                header:creationDate,
                meta:"Create Date of this contract",
                description:"The date when hirer posted this contract",
                style: {overflowWrap:'break-word'}
            }
        ];

        return <Card.Group items={items} />;
    }

    render(){
        return (
            <Layout>
                <h2>Status: {this.props.myStatus}</h2>
                <h3>Show Work Contract: {this.props.address} </h3>
                <Grid>
                    <Grid.Row>
                    <Grid.Column width={5}>
                        {this.renderCards()}
                        
                    </Grid.Column>
                    <Grid.Column width={3}>
                    {this.renderCards()}
                    </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        <Link route={`/workcontract/${this.props.address}/evidence`}>
                            <a>
                                <Button primary>
                                    View work evidences
                                </Button>
                            </a>
                        </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
               
                
            </Layout>

        );

    }
}


export default WorkContractShow;