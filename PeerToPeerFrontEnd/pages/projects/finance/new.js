import React, { Component } from "react";
import CreateCashOrder from "../../../components/CreateCashOrder";
import Layout from "../../../components/Layout";
import workContractfunc from "../../../ethereum/project";
import web3 from "../../../ethereum/web3_query";

import {Link,Router} from '../../../routes';

const debug = require("debug")("app:DEBUG");
const myconfig = require("../../../config/SystemSetting");

import { Message, TextArea, Button, Form } from "semantic-ui-react";
/*
export default()=>{
    return (

        <h1>new project</h1>

    );
};*/

class CreateNewDeposit extends Component {
  static async getInitialProps(props) {
    //running in server
    const ecashorder_url = myconfig("ecashorder_url");

    debug(`Running initial prop: URL of webservice:${ecashorder_url}`);
    const address = props.query.address;
    
    return { ecashorder_url ,address};
  }
  constructor(props) {
    super(props);

    this.state = {
      user: "hirer",
      showCashOrderCreate: true,
      MyEashOrder: null,
      statusMessage: "",
      loading: false,
      address: this.props.address
      ,disableCommit:false
    };
  }

  onDepositContract = async event => {
    event.preventDefault();
    
    this.setState({ loading: true, statusMessage: "" });
    //console.log("address:",this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      //let strNewECashOrder = JSON.stringify(this.state.MyEashOrder, null, 4);
      let strNewECashOrder = JSON.stringify(this.state.MyEashOrder);
      const workContract = workContractfunc(this.props.address);
      await workContract.methods
        .deployCashOrder(strNewECashOrder)
        .send({ from: accounts[0] });

      Router.replace(`/workcontract/${this.props.address}`);
    } catch (ex) {
      //console.log(ex);
      this.setState({ statusMessage: ex.message });
    } finally {
      this.setState({ loading: false ,disableCommit:true});
    }
  };

  render() {
    return (
      <Layout user={this.state.user} onUserChange={user => {}}>
        {this.state.showCashOrderCreate ? (
          <CreateCashOrder
            user={this.state.user}
            onECashOrderFinish={eCashOrder => {
              this.setState({
                MyEashOrder: eCashOrder,
                showCashOrderCreate: false
              });
            }}
            webserviceurl={this.props.ecashorder_url}
          />
        ) : (
          <Form error={this.state.statusMessage.length>0}>
            <Form.Field>
              <label>eCashOrder retrieved</label>
              <TextArea
                placeholder="eCashOrder"
                value={JSON.stringify(this.state.MyEashOrder, null, 4)}
                rows={12}
              />
              <Button
                loading={this.state.loading}
                primary={true}
                onClick={this.onDepositContract}
                disabled={this.disableCommit}
              >
                Next
              </Button>
            </Form.Field>
            <Message error header="oops!" content={this.state.statusMessage} />
          </Form>
        )}
      </Layout>
    );
  }
}

export default CreateNewDeposit;
