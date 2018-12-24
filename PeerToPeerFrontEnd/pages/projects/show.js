import React,{Component} from 'react';
import Layout from '../../components/Layout';
import workContractfunc from "../../ethereum/project";
import {Card,Grid, Button,Form,Message}  from 'semantic-ui-react'; 
import web3 from '../../ethereum/web3_query';
import {Link,Router} from '../../routes';
import ShowCashOrder from "../../components/ShowCashOrder";
const myconfig = require("../../config/SystemSetting");



const StatusMap = require("../../ethereum/WorkContractStatus");

class WorkContractShow extends Component{
    //running in server
    static emptyAddress="0x0000000000000000000000000000000000000000";
    
    static async FreshSummary(workContract){
        const summary={};
        
        summary["myStatus"]=StatusMap[ await workContract.methods.myStatus().call() ];
        summary["hirer"]=await workContract.methods.hirer().call();
        summary["hirerName"]=await workContract.methods.getMemberName(summary["hirer"]).call();
        summary["hiree"] = await workContract.methods.hiree().call();
        if(summary["hiree"]==WorkContractShow.emptyAddress){
            summary["hireeName"]="";
        }else{
            summary["hireeName"]=await workContract.methods.getMemberName(summary["hiree"]).call();
        }
        
        summary["task_description"] = await workContract.methods.task_description().call();
        summary["reward"]=await workContract.methods.reward().call();
        summary["duration"]=await workContract.methods.duration().call();
        summary["creationDate"]=new Date(await workContract.methods.creationDate().call() *1000).toLocaleDateString();
        summary["executionDate"]=new Date(await workContract.methods.executionDate().call() *1000);
        
        summary["hirerEncryptedCashOrder"]=await workContract.methods.hirerEncryptedCashOrder().call();
        summary["hireeEncryptedCashOrder"]=await workContract.methods.hireeEncryptedCashOrder().call();
        return summary;
    }

    static async getInitialProps(props){
        const workContract =workContractfunc(props.query.address);
        const ecashorder_url = myconfig("ecashorder_url");
        
        const summary=await this.FreshSummary(workContract);

        
        return {
            address:props.query.address,
            summary,
            ecashorder_url
        };
    }
    constructor(props){
        super(props);
        
        
        this.state = {
            user:"",
            loading:false,
            statusMessage:"",
            summary:this.props.summary
        }
        
    }
    async componentDidMount(){
        const accounts = await web3.eth.getAccounts();
        
        let user;
        let summary = this.state.summary;
        if(summary["hirer"] == accounts[0]){
            user=summary["hirerName"];
        }else if(summary["hiree"] == accounts[0]){
            user=summary["hireeName"];
        }
        //console.log(`user:${this.state.user}, account: ${accounts[0]}, hirer: ${summary["hirer"]} `)
        this.setState({user});
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
        }=this.state.summary;
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
        if(hiree!=WorkContractShow.emptyAddress){
            items.push(
                {
                    header:hiree+":("+hireeName+")",
                    meta:"hiree of this contract",
                    description:"Hiree is workong on this contract",
                    style: {overflowWrap:'break-word'}
                }

            );
        }
        return <Card.Group items={items} />;
    }

    takeJob = async(event)=>{
        event.preventDefault();
        const workContract =workContractfunc(this.props.address);
        this.setState({loading:true,statusMessage:""});
        try{
            const accounts = await web3.eth.getAccounts();
            await workContract.methods.hireeTakeJob().
                send({from:accounts[0] });
            //this.setState({loading:false});
            const summary=await WorkContractShow.FreshSummary(workContract);
            this.setState({summary:summary});
            //Router.pushRoute(`/workcontract/${this.props.address}`);
        }catch(ex){
            console.log(ex);
            this.setState({statusMessage:ex.message})
        }finally{
            this.setState({loading:false});
        }

    }
    testRefresh=async(event)=>{
        event.preventDefault();
        const workContract =workContractfunc(this.props.address);
        this.setState({loading:true,statusMessage:""});
        try{
            const accounts = await web3.eth.getAccounts();
            
            const summary=await WorkContractShow.FreshSummary(workContract);
            this.setState({summary:summary});
            //Router.pushRoute(`/workcontract/${this.props.address}`);

        }catch(ex){
            console.log(ex);
            this.setState({statusMessage:ex.message})
        }finally{
            this.setState({loading:false});
        }
        console.log(this.state.summary);
    }

    render(){
        return (
            <Layout user={this.state.user}>
                <h2>Status: {this.state.summary.myStatus}</h2>
                <h3>Show Work Contract: {this.props.address} </h3>
                <Grid>
                    <Grid.Row >
                    <Grid.Column width={10}>
                        {this.renderCards()}
                        
                    </Grid.Column>
                    <Grid.Column width={6} >
                        <ShowCashOrder
                            webserviceurl={this.props.ecashorder_url}
                            hirerEncryptedCashOrder={this.props.summary.hirerEncryptedCashOrder}
                            hireeEncryptedCashOrder={this.props.summary.hireeEncryptedCashOrder}
                            />
                    </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.state.summary.myStatus == "PROCUREMENT" ?
                                <Form error={this.state.statusMessage.length>0} >
                                <Button primary onClick={this.takeJob} loading={this.state.loading}> 
                                    Take Job
                                </Button>
                                <Message error header="oops!" content={this.state.statusMessage} />
                                </Form>
                                :
                                <Link route={`/workcontract/${this.props.address}/worklog`}>
                                   <a>
                                        <Button primary >
                                            View work evidences
                                        </Button>
                                    </a>
                                </Link>

                            }


                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
               
                
            </Layout>

        );

    }
}


export default WorkContractShow;