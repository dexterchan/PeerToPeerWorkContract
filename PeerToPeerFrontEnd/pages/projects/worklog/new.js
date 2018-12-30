import React, { Component } from "react";
import Layout from "../../../components/Layout";
import WorkLogRow from "../../../components/WorkLogRow";
import {  Button, Form, Input,TextArea, Label,Message } from "semantic-ui-react";
import { Link,Router } from "../../../routes";
import workContractfunc from "../../../ethereum/project";
import web3 from "../../../ethereum/web3_query";

class NewWorkLog extends Component {
  static async getInitialProps(props) {
    //running in server
    const { address } = props.query;
    return {
      address
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      statusMessage: "",
      loading: false,
      logDes: "",
      user:""
    };
  }

  onSubmit = async (event) => {
    try {
      this.setState({ loading: true, statusMessage: "" });
      const accounts = await web3.eth.getAccounts();
      const hireeAddress = accounts[0]; //A hack
      
      const workContract = workContractfunc(this.props.address);
      await workContract.methods
        .hireeSubmitWork(this.state.logDes)
        .send({ from: hireeAddress });
        //Router replace to refresh the target page!!!
        Router.replace(`/workcontract/${this.props.address}/worklog`);
    } catch (ex) {
      this.setState({ statusMessage: ex.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Layout onUserChange={(user) => {
        
        this.setState({user});
        
      }}>
        <Link route={`/workcontract/${this.props.address}/worklog`}>
          <a>&lt;&lt;Back</a>
        </Link>

        <h3>{this.state.user} creates a work log</h3>
        <Label>Contract address: {this.props.address}</Label>
        <Form
          onSubmit={this.onSubmit}
          error={this.state.statusMessage.length > 0}
        >
          <Form.Field>
            <label>log description</label>
            <TextArea
              value={this.state.logDes}
              
              onChange={(e,data)=>{
                this.setState({logDes:data.value});
            }}
            />
          </Form.Field>
          <Button primary loading={this.state.loading}>
            Create
          </Button>
          <Message error header="oops!" content={this.state.statusMessage} />
        </Form>
      </Layout>
    );
  }
}

export default NewWorkLog;
