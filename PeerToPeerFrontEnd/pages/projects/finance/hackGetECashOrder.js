import React, { Component } from "react";
import Layout from "../../../components/Layout";
import workContractfunc from "../../../ethereum/project";
import web3 from "../../../ethereum/web3_query";

import { Link, Router } from "../../../routes";
const myconfig = require("../../../config/SystemSetting");

const debug = require("debug")("app:DEBUG");
import { Dropdown,Message, TextArea, Button, Grid, Form } from "semantic-ui-react";

class HackGetECashOrder extends Component {
  hirerhiree_list = [
    {
      text: "hirer",
      value: "hirer"
    },
    {
      text: "hiree",
      value: "hiree"
    }
  ];
  static async FreshSummary(workContract) {
    const summary = {};
    summary[
      "hireeEncryptedCashOrder"
    ] = await workContract.methods.hireeEncryptedCashOrder().call();
    summary[
      "hirerEncryptedCashOrder"
    ] = await workContract.methods.hirerEncryptedCashOrder().call();
    return summary;
  }
  static async getInitialProps(props) {
    //running in server
    const workContract = workContractfunc(props.query.address);
    const ecashorder_url = myconfig("ecashorder_url");
    const summary = await HackGetECashOrder.FreshSummary(workContract);
    //console.log(summary);
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
        showCommit:false,
        
        showHirerHiree:"hirer",
        decryptedDoc:"",
        encryptedDoc:"",
        
      };
  }

  getCurrentECashOrder = hirerhiree => {
    return (hirerhiree == "hirer"
      ? JSON.stringify(this.state.summary.hirerEncryptedCashOrder, null, 4)
      : JSON.stringify(this.state.summary.hireeEncryptedCashOrder, null, 4)
    )
      .replace(/\\\"/g, '"')
      .replace(/\"{/, "{")
      .replace(/}\"/, "}");
  };

  componentDidMount(){
    this.setState({encryptedDoc: this.getCurrentECashOrder(this.state.showHirerHiree)});
  }

  

  onDecrypt=async(event)=>{
    event.preventDefault();
    this.setState({loading:true});
    
    try {
        //const payee = this.state.summary.hireeName;
        const URL = `${this.webserviceurl}/getDecryptedEcashOrder`; 
        
        const eCashOrderJSON = JSON.parse(
          this.state.encryptedDoc.replace(/\\\"/g, '"')
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


  render() {
    return (
      <Layout user={this.state.user}>
        <h3>Get EcashOrder</h3>
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
                    <Dropdown
                      placeholder="hirer or hiree"
                      fluid
                      selection
                      options={this.hirerhiree_list}
                      value={this.state.showHirerHiree}
                      onChange={(e, data) => {
                        this.setState({ showHirerHiree: data.value });
                        this.setState({
                          encryptedDoc: this.getCurrentECashOrder(data.value)
                        });
                      }}
                    />
                </Form.Field>
                <Form.Field>
                  <label>encryted eCashorder</label>
                  <TextArea
                    placeholder="encrypted eCashOrder"
                    value={this.state.encryptedDoc.replace(
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
                  <label>decrypted eCashorder</label>
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
          
        </Grid>
      </Layout>
    );
  }
}

export default HackGetECashOrder;
