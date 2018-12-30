import React,{Component} from "react";
import CreateCashOrder from "../../components/CreateCashOrder";
import Layout from "../../components/Layout";
const debug = require("debug")("app:DEBUG");
const myconfig = require("../../config/SystemSetting");

import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3_query";
import { Message,TextArea,Button,Form,Input} from 'semantic-ui-react';

import {Link,Router} from '../../routes';


class CreateNewProject extends Component{
    
    
    constructor(props){
        super(props);
        this.state = {
            statusMessage: "",
            loading: false,
            task_des:"",
            reward:0,
            accepthireeMinCredit:0,
            duration:"",
            feedback:"",
            finish:false
        }
    }

    onSubmit=async(event)=>{
        event.preventDefault();
        try {
            this.setState({ loading: true, statusMessage: "" });
            const accounts = await web3.eth.getAccounts();
            //console.log(factory);
            const retObj=await factory.methods.createProject(
                this.state.task_des,
                this.state.reward,
                this.state.accepthireeMinCredit,
                this.state.duration
            ).send(
                {
                    from: accounts[0]
                }
            );
            const txnHash=retObj.transactionHash;
            
            this.setState({finish:true,feedback:`Please check details in https://rinkeby.etherscan.io/tx/${txnHash}`});
        }catch(ex){
            this.setState({statusMessage:ex.message});
        }finally{
            this.setState({ loading: false });
        }
    };
    

    render(){
        return (
            <Layout  onUserChange={
                (user)=>{
                    this.setState({user});
                    //Console.log(`Index page chnage to ${user}`);
                }
            } >

            <h3>Create a new Work Contract</h3>

                <Form onSubmit={this.onSubmit}
                error={this.state.statusMessage.length > 0}>
                    <Form.Field>
                        <label>Create a new Work Contract</label>
                        <TextArea placeholder="Task description" value={this.state.task_des} rows={12} 
                        onChange={event=>{this.setState({task_des:event.target.value})}}/>
                        
                    </Form.Field>

                    <Form.Field>
                        <label>Reward</label>
                        <Input placeholder="Reward in dollors" value={this.state.reward} 
                         onChange={event=>{this.setState({reward:event.target.value})}}/>
                    </Form.Field>

                    <Form.Field>
                        <label>Accept hiree with minimum credit</label>
                        <Input placeholder="only accept hiree with minimum credit (value>0)" value={this.state.accepthireeMinCredit} 
                         onChange={event=>{this.setState({accepthireeMinCredit:event.target.value})}}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Expected task duration</label>
                        <Input placeholder="time duration in days/weeks/months" value={this.state.duration} 
                         onChange={event=>{this.setState({duration:event.target.value})}}/>
                    </Form.Field>
                    <Button loading={this.state.loading} primary={true} disabled={this.state.finish}>Confirm</Button>
                    <Message error header="oops!" content={this.state.statusMessage} />
                    <Message color="grey" content={this.state.feedback} hidden={this.state.feedback.length==0} />
                </Form>


                
            </Layout>
        );
    }
}

export default CreateNewProject;
