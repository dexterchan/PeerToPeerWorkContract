import React, { Component } from "react";
import Layout from "../../../components/Layout";
import workContractfunc from "../../../ethereum/project";
import web3 from "../../../ethereum/web3_query";

import { Link, Router } from "../../../routes";

const debug = require("debug")("app:DEBUG");
const myconfig = require("../../../config/SystemSetting");

import { Message, TextArea, Button, Grid, Form } from "semantic-ui-react";
const StatusMap = require("../../../ethereum/WorkContractStatus");

class MakePayment extends Component {
  static emptyAddress = "0x0000000000000000000000000000000000000000";

  static async FreshSummary(workContract) {
    const summary = {};

    summary["myStatus"] =
      StatusMap[await workContract.methods.myStatus().call()];
    summary["hirer"] = await workContract.methods.hirer().call();
    summary["hirerName"] = await workContract.methods
      .getMemberName(summary["hirer"])
      .call();
    summary["hiree"] = await workContract.methods.hiree().call();
    if (summary["hiree"] == MakePayment.emptyAddress) {
      summary["hireeName"] = "";
    } else {
      summary["hireeName"] = await workContract.methods
        .getMemberName(summary["hiree"])
        .call();
    }

    summary[
      "hirerEncryptedCashOrder"
    ] = await workContract.methods.hirerEncryptedCashOrder().call();
    return summary;
  }
  static async getInitialProps(props) {
    //running in server
    const workContract = workContractfunc(props.query.address);
    const ecashorder_url = myconfig("ecashorder_url");
    const summary = await MakePayment.FreshSummary(workContract);

    debug(`Running initial prop: URL of webservice:${ecashorder_url}`);
    const address = props.query.address;

    return { ecashorder_url, address, summary };
  }
  constructor(props) {
    super(props);
    this.webserviceurl = this.props.ecashorder_url;
    this.state = {
      user: "",
      loading: false,
      commitLoading: false,
      statusMessage: "",
      summary: this.props.summary,
      hireeEncryptedCashOrder: "",
      showCommit:false
    };
  }

  onPayment = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      const payee = this.state.summary.hireeName;
      const URL = `${this.webserviceurl}/changeowner/${payee}`; //"http://localhost:8001/api/ecashorder";//config.get("ecashorder");

      const eCashOrderJSON = JSON.parse(
        this.state.summary.hirerEncryptedCashOrder.replace(/\\\"/g, '"')
      );

      const response = await fetch(URL, {
        method: "POST",
        //mode: 'CORS', not using cross-fetch
        body: JSON.stringify(eCashOrderJSON),
        headers: { "Content-Type": "application/json" }
      });
      const hireeEncryptedCashOrder = JSON.stringify(await response.json());

      this.setState({ hireeEncryptedCashOrder });
    } catch (ex) {
      this.setState({statusMessage:ex.message});
    } finally {
      this.setState({ loading: false, showCommit: true });
    }
  };

  onCommit = async (event)=>{
    event.preventDefault();
    this.setState({statusMessage:"",commitLoading:true});
    try {
      const accounts = await web3.eth.getAccounts();
      const workContract = workContractfunc(this.props.address);
      await workContract.methods
        .hirerMakePayment( this.state.hireeEncryptedCashOrder)
        .send({ from: accounts[0] });

      Router.replace(`/workcontract/${this.props.address}`);
    }catch(ex){
      this.setState({statusMessage:ex.message});
    }finally{
      this.setState({ commitLoading:false })
    }
  }

  render() {
    return (
      <Layout user={this.state.user}>
        <h3>Make Payment to {this.state.summary.hireeName}</h3>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Button
              fluid
              loading={this.state.loading}
              primary
              
              onClick={this.onPayment}
            >
              Transfer eCashorder ownership to {this.state.summary.hireeName}->
            </Button>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>{this.state.summary.hirerName} encryted eCashorder</label>
                  <TextArea
                    placeholder="hirer eCashOrder"
                    value={this.state.summary.hirerEncryptedCashOrder.replace(
                      /\\\"/g,
                      '"'
                    )}
                    //style={{ overflowWrap: "nowrap" }}
                    rows={12}
                    onChange={(e, data) => {}}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>

            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>{this.state.summary.hireeName} encryted eCashorder</label>
                  <TextArea
                    placeholder="hiree ecashorder"
                    value={this.state.hireeEncryptedCashOrder.replace(
                      /\\\"/g,
                      '"'
                    )}
                    style={{ overflowWrap: "nowrap" }}
                    rows={12}
                    onChange={(e, data) => {}}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {this.state.showCommit?
                <Form error={this.state.statusMessage.length>0 } visible={this.state.showCommit}>
                <Button
                  floated="right"
                  loading={this.state.commitLoading}
                  color="green"
                  onClick={this.onCommit}
                >
                  Commit to Contract
                </Button>
                <Message error header="oops!" content={this.state.statusMessage} />
                </Form>
              :""
              }
              
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default MakePayment;
