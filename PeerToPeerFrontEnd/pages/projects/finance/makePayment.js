import React, { Component } from "react";
import Layout from "../../../components/Layout";
import workContractfunc from "../../../ethereum/project";
import web3 from "../../../ethereum/web3_query";

import { Link, Router } from "../../../routes";

const debug = require("debug")("app:DEBUG");
const myconfig = require("../../../config/SystemSetting");

import { Message, TextArea, Button, Grid } from "semantic-ui-react";
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
    const summary = undefined; //await this.FreshSummary(workContract);

    debug(`Running initial prop: URL of webservice:${ecashorder_url}`);
    const address = props.query.address;

    return { ecashorder_url, address, summary };
  }
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      loading: false,
      statusMessage: "",
      summary: this.props.summary
    };
  }
  render() {
    return (
      <Layout user={this.state.user}>
        <h3>Make Payment to hiree!!!</h3>
      </Layout>
    );
  }
}

export default MakePayment;
