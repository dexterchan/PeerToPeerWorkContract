import React, { Component } from "react";
const debug = require("debug")("app:DEBUG");

import { Dropdown, Button, Form, Message, Label, Input } from 'semantic-ui-react';
import { Link } from "../routes";
const fetch = require('node-fetch');




class CreateCashOrder extends Component {

    
    constructor(props) {
        super(props);
        //console.log(`Constructor:${props}`);
        //debug(`Constructor:${props.user}`);
        //debug(props);
        this.state = {
            user: props.user,
            bank: "",
            eCashOrder: "",
            value: "",
            statusMessage:"",
            loading:false
        };
        this.webserviceurl = this.props.webserviceurl;
        debug(`URL of webservice:${this.webserviceurl})`);
    }
    financial_institution_list=[
        {
            text: 'bankA',
            value: 'bankA'
        },
        {
            text: 'bankB',
            value: 'bankB'
        }
    ];
    componentDidMount() {
        
        debug(`componentDidMount:${this.state.user}`);
    }
    checkValue= (event)=>{
        const r = event.target.value;
        
        let parseValue=Number.parseFloat(r);
        
        if (Number.isNaN(parseValue)) {
            
            this.setState({value:""});
            this.setState({statusMessage:"numeric value"});
            return;
        }
        if(r.endsWith(".") || r.endsWith("0")) {
            parseValue=r;
        }else{
            parseValue=parseValue.toString();
        }
        this.setState({value:parseValue})
        this.setState({statusMessage:""})
    };

    onSubmit=async (event)=>{
        event.preventDefault();//avoid browser to auto-submit the form
        const headers = {};
        headers["Content-Type"]="application/json";

        const data={
            userid:this.state.user,
            finEntity:this.state.bank,
            amount:this.state.value,
            DepositOrLoan:true
        };

        //console.log(data);
        const URL=this.webserviceurl;//"http://localhost:8001/api/ecashorder";//config.get("ecashorder");
        
        const response = await fetch(URL, {
            method: 'POST',
            //mode: 'CORS', not using cross-fetch
            body: JSON.stringify(data),
            headers: headers
        });
        const newEashOrder= await response.json();
        this.props.onECashOrderFinish(newEashOrder);
        //console.log();
    };

    

    render() {

        return (

            <div>
                <h1> {this.state.user} prepares eCash Order from a financial institution</h1>
                <Form onSubmit={this.onSubmit}  error={this.state.statusMessage.length>0} >
                    
                    <Form.Field>
                        <label>Amount</label>

                        <Input
                            label="$"
                            labelPosition='left'
                            placeholder='numeric value'
                            value={this.state.value}
                            onChange={this.checkValue}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Financial institution</label>
                        <Dropdown placeholder='Choose financial institution' fluid selection options={this.financial_institution_list} value={this.state.bank} 
                            onChange={(e, data) => {
                                this.setState({ bank: data.value });
                            }}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Remark</label>
                        <Input labelPosition='right'
                            placeholder='Project description'
                            value={this.value}
                        />
                    </Form.Field>
                    <Button loading={this.state.loading} primary={true} type='submit'>Create!</Button>
                    <Message error header="oops!" content={this.state.statusMessage} />
                </Form>
                
            </div>
        );
    }

     
}

export default CreateCashOrder;