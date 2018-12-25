import React, { Component } from "react";
import Layout from "../../../components/Layout";
import WorkLogRow from "../../../components/WorkLogRow";
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
        const workAccepted = await workContract.methods.workAccepted().call();

        return {workLogs,workAccepted};
    }
    static async getInitialProps(props){
        const workContract =workContractfunc(props.query.address);
        const {workLogs,workAccepted}=await WorkLogIndex.freshWorkLog(workContract);
        
        return {
            address:props.query.address,
            workLogs,workAccepted
        };
    }

    async updateMyWorkLog(workContract){
        const {workLogs,workAccepted}=await WorkLogIndex.freshWorkLog(workContract);
        this.setState({workLogs,workAccepted});
        console.log(this.state.workLogs);
    }

    constructor(props){
        super(props);
        this.state={
            //address:this.props.address,
            workLogs:this.props.workLogs,
            workAccepted:this.props.workAccepted
        };
        console.log("Work accepted:",this.state.workAccepted);
    }

    componentDidMount(){
        //console.log(this.state.workLogs);
    }

    renderWorkLogRow(){
        return this.state.workLogs.map(
            (wklog,index) =>{
                return <WorkLogRow
                    key={index} //key as required in JSX 
                    ID={index}
                    workLog={wklog}
                    address={this.props.address}
                    callback={this.updateMyWorkLog}
                />
            }
        );
    }
    render(){
        const {Header, Row, HeaderCell, Body}=Table;
        return(

            <Layout>
                <Link route={`/workcontract/${this.props.address}`}>
                    <a>
                        &lt;&lt;Back
                </a>
                </Link>
                <h3>Work log </h3>
                {this.state.workAccepted?
                    <Label color="green">ACCEPTED</Label>:
                    <Label color="olive">On going</Label>
                }
                <Label>Contract address: {this.props.address}</Label>

                <Table>
                <Header>
                    <Row>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>hiree Submit Date</HeaderCell>
                        <HeaderCell>hirer comment</HeaderCell>
                        <HeaderCell>status</HeaderCell>
                        
                        <HeaderCell>Action</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {this.renderWorkLogRow()}
                </Body>
            </Table>
            </Layout>
        );

    }

}

export default WorkLogIndex;
