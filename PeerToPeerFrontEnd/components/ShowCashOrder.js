import React, { Component } from "react";
const debug = require("debug")("app:DEBUG");

import { Dropdown, Button, Form, Message, Label, Input ,TextArea} from 'semantic-ui-react';
import { Link,Router } from "../routes";
const fetch = require('node-fetch');



class ShowCashOrder extends Component {

    hirerhiree_list=[
        {
            text: 'hirer',
            value: 'hirer'
        },
        {
            text: 'hiree',
            value: 'hiree'
        }
    ];
    
    constructor(props) {
        super(props);
        //console.log(`Constructor:${props}`);
        //debug(`Constructor:${props.user}`);
        //debug(props);
        this.state = {
            hirerEncryptedCashOrder:this.props.hirerEncryptedCashOrder,
            hireeEncryptedCashOrder:this.props.hireeEncryptedCashOrder,
            statusMessage:"",
            showHirerHiree:"hirer",
            loading:false,
            currentECashOrder:"",
            depositContract:this.props.depositContract
        };
        
        this.webserviceurl = this.props.webserviceurl;
        debug(`URL of webservice:${this.webserviceurl})`);
        
    }
    
    componentDidMount() {
        
        debug(`componentDidMount:${this.state.user}`);
        this.setState({currentECashOrder:this.getCurrentECashOrder(this.state.showHirerHiree)});
    }
    
    getCurrentECashOrder=(hirerhiree)=>{
        return ((hirerhiree == "hirer") ?
        JSON.stringify(
            this.state.hirerEncryptedCashOrder, null, 4) :
        JSON.stringify(
            this.state.hireeEncryptedCashOrder, null, 4)).replace(/\\\"/g,"\"").replace(/\"{/,"{").replace(/}\"/,"}");
    }

    onValidate=async (event)=>{
        event.preventDefault();
        console.log("Validate:",this.state.currentECashOrder );
        
    };

    onDeposit = async(event)=>{
        event.preventDefault();
        Router.pushRoute(`/workcontract/${this.props.address}/finance/${this.props.mystatus}`);
    }


    

    render() {

        return (

            <div>
                <h1> {this.state.user} View eCash Order </h1>
                <Form   error={this.state.statusMessage.length>0} >
                    

                    <Form.Field>
                        <label>eCash Order Encrypted by:</label>
                        <Dropdown placeholder='hirer or hiree' fluid selection options={this.hirerhiree_list} value={this.state.showHirerHiree}
                            onChange={(e, data) => {
                                this.setState({ showHirerHiree: data.value});
                                this.setState({ currentECashOrder:this.getCurrentECashOrder(data.value)});
                            }} />
                    </Form.Field>
                    
                    <Form.Field>
                        <label>eCashOrder retrieved</label>
                        <TextArea placeholder="eCashOrder" value={
                            //this.getCurrentECashOrder(this.state.showHirerHiree)
                            this.state.currentECashOrder.replace(/\\\"/g,"\"")
                        }
                        style={{overflowWrap:'nowrap'}}
                        rows={12}
                        
                        onChange={(e,data)=>{
                            this.setState({currentECashOrder:data.value});
                        }}
                         />
                        <Button floated="left" loading={this.state.loading} primary={true} onClick={this.onValidate} >Validate it!</Button>
                        <Button  floated="right"  disabled={!(this.state.depositContract==this.state.showHirerHiree) } onClick={this.onDeposit}>
                            Deposit Contract
                        </Button>
                    </Form.Field>
                    
                    
                    
                    <Message error header="oops!" content={this.state.statusMessage} />
                </Form>
                
            </div>
        );
    }

     
}

export default ShowCashOrder;