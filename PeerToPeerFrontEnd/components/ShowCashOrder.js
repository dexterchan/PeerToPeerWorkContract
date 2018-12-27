import React, { Component } from "react";
const debug = require("debug")("app:DEBUG");

import {
  Dropdown,
  Button,
  Form,
  Message,
  Label,
  Input,
  TextArea
} from "semantic-ui-react";
import { Link, Router } from "../routes";
const fetch = require("node-fetch");

const ValidateState = {
  0: { text: "VALIDATE it!", color: "twitter" },
  1: { text: "GOOD", color: "green" },
  2: { text: "BAD", color: "red" }
};
class ShowCashOrder extends Component {
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

  constructor(props) {
    super(props);
    //console.log(`Constructor:${props}`);
    //debug(`Constructor:${props.user}`);
    //debug(props);
    this.state = {
      hirerEncryptedCashOrder: this.props.hirerEncryptedCashOrder,
      hireeEncryptedCashOrder: this.props.hireeEncryptedCashOrder,
      statusMessage: "",
      showHirerHiree: "hirer",
      loading: false,
      currentECashOrder: "",
      depositContract: this.props.depositContract,
      myValidateStatus: 0
    };

    this.webserviceurl = this.props.webserviceurl;
    debug(`URL of webservice:${this.webserviceurl})`);
  }

  componentDidMount() {
    debug(`componentDidMount:${this.state.user}`);
    this.setState({
      currentECashOrder: this.getCurrentECashOrder(this.state.showHirerHiree)
    });
  }

  getCurrentECashOrder = hirerhiree => {
    return (hirerhiree == "hirer"
      ? JSON.stringify(this.state.hirerEncryptedCashOrder, null, 4)
      : JSON.stringify(this.state.hireeEncryptedCashOrder, null, 4)
    )
      .replace(/\\\"/g, '"')
      .replace(/\"{/, "{")
      .replace(/}\"/, "}");
  };

  onValidate = async event => {
    event.preventDefault();
    this.setState({ loading: true });
    //console.log("Validate:", this.state.currentECashOrder);
    const headers = {};
    headers["Content-Type"] = "application/json";

    const URL = this.webserviceurl + "/verifysignature"; //"http://localhost:8001/api/ecashorder";//config.get("ecashorder");

    const response = await fetch(URL, {
      method: "POST",
      //mode: 'CORS', not using cross-fetch
      body: this.state.currentECashOrder,
      headers: headers
    });
    this.setState({ loading: false });

    const ret = await response.json();
    //console.log(ret);
    if (ret.result == "valid") {
      this.setState({ myValidateStatus: 1 });
    } else {
      this.setState({ myValidateStatus: 2 });
    }
  };

  onDeposit = async event => {
    event.preventDefault();
    Router.pushRoute(
      `/workcontract/${this.props.address}/finance/new`
    );
  };

  render() {
    return (
      <div>
        <h1> {this.state.user} View eCash Order </h1>
        <Form error={this.state.statusMessage.length > 0}>
          <Form.Field>
            <label>eCash Order Encrypted by:</label>
            <Dropdown
              placeholder="hirer or hiree"
              fluid
              selection
              options={this.hirerhiree_list}
              value={this.state.showHirerHiree}
              onChange={(e, data) => {
                this.setState({ showHirerHiree: data.value });
                this.setState({
                  currentECashOrder: this.getCurrentECashOrder(data.value)
                });
              }}
            />
          </Form.Field>

          <Form.Field>
            <label>eCashOrder retrieved</label>
            <TextArea
              placeholder="eCashOrder"
              value={
                //this.getCurrentECashOrder(this.state.showHirerHiree)
                this.state.currentECashOrder.replace(/\\\"/g, '"')
              }
              style={{ overflowWrap: "nowrap" }}
              rows={12}
              onChange={(e, data) => {
                this.setState({ currentECashOrder: data.value });
              }}
            />
            <Button
              floated="left"
              loading={this.state.loading}
              //primary={true}
              onClick={this.onValidate}
              color={ValidateState[this.state.myValidateStatus].color}
            >
              {ValidateState[this.state.myValidateStatus].text}
            </Button>
            <Button
              floated="right"
              disabled={
                !(this.state.depositContract == this.state.showHirerHiree)
              }
              onClick={this.onDeposit}
            >
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
