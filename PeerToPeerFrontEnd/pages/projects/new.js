import React,{Component} from "react";
import CreateCashOrder from "../../components/CreateCashOrder";
import Layout from "../../components/Layout";
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
    ]
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
                }/> : 
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
