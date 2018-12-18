import React,{Component} from "react";
import CreateCashOrder from "../../components/CreateCashOrder";
import Layout from "../../components/Layout";
const debug = require("debug")("app:DEBUG");
const myconfig = require("../../config/SystemSetting");

import { Dropdown,TextArea,Button,Form} from 'semantic-ui-react';
/*
export default()=>{
    return (

        <h1>new project</h1>

    );
};*/


class CreateNewProject extends Component{
    userOptions = [
        {
            text: 'hirer',
            value: 'hirer'
        },
        {
            text: 'hiree',
            value: 'hiree'
        }
    ];
    static async getInitialProps(){
        //running in server
        const ecashorder_url = myconfig("ecashorder_url");
        
        debug(`Running initial prop: URL of webservice:${ecashorder_url}`);
        
        return {ecashorder_url};
    }
    constructor(props){
        super(props);
        this.state = {
            user:"hirer",
            showCashOrderCreate:true,
            MyEashOrder:null
        }
    }

    

    render(){
        return (
            <Layout user={this.state.user}  onUserChange={
                (user)=>{
                    this.setState({user} );
                }
            } >
            
                
                {this.state.showCashOrderCreate ? 
                <CreateCashOrder user={this.state.user} onECashOrderFinish={
                    (eCashOrder)=>{
                        this.setState({MyEashOrder:eCashOrder,showCashOrderCreate:false} );
                    }
                }
                webserviceurl={this.props.ecashorder_url}
                /> : 
                <Form>
                    <Form.Field>
                    <label>eCashOrder retrieved</label>
                    <TextArea placeholder="eCashOrder" value={JSON.stringify(this.state.MyEashOrder,null,4)}/>
                    <Button loading={this.state.loading} primary={true} >Next</Button>
                    </Form.Field>
                </Form>
                }


            </Layout>
        );
    }
}

export default CreateNewProject;
