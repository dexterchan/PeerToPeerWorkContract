import React, {Component} from "react";
import {Table,Button,TextArea}  from 'semantic-ui-react'; 
import web3 from "../ethereum/web3_query";
import workContractfunc from "../ethereum/project";
import WorkLogIndex from "../pages/projects/worklog/index";

class WorkLogRow extends Component{

    constructor(props){
        super(props);
        this.state={
            acceptloading:false,
            rejectLoading:false,
            active: props.ID==0,
            hirerComment:props.workLog.hirerComment,
            acceptloading:false
        }
    }
    
    async updateAcceptReject(accept,reject){
        try{
            this.setState({acceptloading:true});
            const accounts = await web3.eth.getAccounts();
            const hirerAddress = accounts[0];//A hack
            const workContract =workContractfunc(this.props.address);
            
            await workContract.methods.hirerAcceptWork(this.state.hirerComment,accept,reject).send(
                { from: hirerAddress }
            );
            //Router.pushRoute(`/workcontract/${this.props.address}/worklog`);

            const { workLogs, workAccepted } = await WorkLogIndex.freshWorkLog(
                workContract
              );
            await this.props.callback(workLogs, workAccepted);
        }catch(err){
            console.log(err.message);
        }finally{
            this.setState({acceptloading:false});
        }
    }

    onAccept=async(event)=>{
        event.preventDefault();
        await this.updateAcceptReject(true,false);
        
    };
    onReject=async (event)=>{
        event.preventDefault();
        await this.updateAcceptReject(false,true);
    }

    renderActionModule(hirerAccepted,hirerRejected){
        
            return (
                <div>
                <Button color="green" loading={this.state.acceptloading} onClick={this.onAccept}>Accept</Button>
                <Button color="red" loading={this.state.acceptloading} onClick={this.onReject}>Reject</Button>
                </div>
            );
        
    }

    render(){
        const {Row,Cell}=Table;
        const {logDes,hireeSubmitDate,hirerAccepted,hirerRejected} = this.props.workLog;
       
        //
        return(<Row positive={this.state.active}>
            <Cell>{logDes}</Cell>
            <Cell>{new Date( hireeSubmitDate *1000).toLocaleDateString()}</Cell>
            <Cell>{
                this.state.active?
                    <TextArea rows={2} value={this.state.hirerComment}
                    onChange={(e,data)=>{
                        this.setState({hirerComment:data.value});
                    }}/>
                    :this.state.hirerComment
            }</Cell>
            <Cell>{hirerAccepted?"ACCEPTED":(hirerRejected?"REJECTED":"not yet")}</Cell>
            <Cell>
                {
                    this.state.active ?
                        this.renderActionModule(hirerAccepted, hirerRejected) : ""}
            </Cell>
        </Row>);
    }
}

export default WorkLogRow;