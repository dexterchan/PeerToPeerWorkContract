import React, { Component } from "react";
import Layout from "../../../components/Layout";
import workContractfunc from "../../../ethereum/project";
import web3 from "../../../ethereum/web3_query";

import { Link, Router } from "../../../routes";
const myconfig = require("../../../config/SystemSetting");

const debug = require("debug")("app:DEBUG");
import { Message, TextArea, Button, Grid, Form } from "semantic-ui-react";

class GetECashOrder extends Component {
  static async FreshSummary(workContract) {
    const summary = {};
    summary[
      "hireeEncryptedCashOrder"
    ] = await workContract.methods.hireeEncryptedCashOrder().call();
    return summary;
  }
  static async getInitialProps(props) {
    //running in server
    const workContract = workContractfunc(props.query.address);
    const ecashorder_url = myconfig("ecashorder_url");
    const summary = await GetECashOrder.FreshSummary(workContract);

    
    const hiree= await workContract.methods.hiree().call();
    const hireeName=await workContract.methods.getMemberName(hiree).call();

    debug(`Running initial prop: URL of webservice:${ecashorder_url}`);
    const address = props.query.address;

    return { ecashorder_url, address, summary ,hireeName};
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
        showCommit:false,
        decryptedDoc:""
      };
  }

  onDecrypt=async(event)=>{
    event.preventDefault();
    this.setState({loading:true});
    
    try {
        //const payee = this.state.summary.hireeName;
        const URL = `${this.webserviceurl}/getDecryptedEcashOrder`; 
        
        const eCashOrderJSON = JSON.parse(
          this.state.summary.hireeEncryptedCashOrder.replace(/\\\"/g, '"')
        );
        
        const response = await fetch(URL, {
          method: "POST",
          //mode: 'CORS', not using cross-fetch
          body: JSON.stringify(eCashOrderJSON),
          headers: { "Content-Type": "application/json" }
        });
        
        const decryptedDoc = (await response.json());
        console.log("onDecrypt func 4",decryptedDoc.result);
        this.setState({ decryptedDoc:decryptedDoc.result,showCommit:true });
      } catch (ex) {
        this.setState({statusMessage:ex.message});
        console.log(ex);
      } finally {
        this.setState({ loading: false, showCommit: true });
      }
  }

  onCommit = async (event)=>{
    event.preventDefault();
    this.setState({statusMessage:"",commitLoading:true});
    try {
      const accounts = await web3.eth.getAccounts();
      const workContract = workContractfunc(this.props.address);
      await workContract.methods
        .hireeConfirmPayment()
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
        <h3>{this.props.hireeName} Get EcashOrder</h3>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Button
              fluid
              loading={this.state.loading}
              onClick={this.onDecrypt}
              primary
            >
              Retrieve the eCashOrder-->
            </Button>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Form>
                <Form.Field>
                  <label>{this.props.hireeName} encryted eCashorder</label>
                  <TextArea
                    placeholder="hiree eCashOrder"
                    value={this.state.summary.hireeEncryptedCashOrder.replace(
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
                  <label>{this.props.hireeName}  deencryted eCashorder</label>
                  <TextArea
                    placeholder="decrypted eCashOrder"
                    value={this.state.decryptedDoc}
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
                  Confirm got paid
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

export default GetECashOrder;
