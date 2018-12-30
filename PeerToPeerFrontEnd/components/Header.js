import React,{Component} from "react";
import { Menu,Icon,Dropdown, Label } from 'semantic-ui-react';
import {Link} from "../routes";
import web3 from "../ethereum/web3_query";
import factoryFunc from "../ethereum/factory";
//Link object is a React component to render anchor tags in React component
//Link and Menu.Item css conflict with each other!!!
//Link and Menu.Item are mutually exclusive

const userOptions = [
    {
        text: 'hirer',
        value: 'hirer'
    },
    {
        text: 'hiree',
        value: 'hiree'
    }
];

class Header extends Component{
    

    freshAcct = async()=>{
        let username;
        let user;
        let address;
        try{
            const accounts = await web3.eth.getAccounts();
            address=accounts[0];
            user=await factoryFunc.methods.getMemberName(address).call();
            username = `${user} ${address}`;
            
            if(user!=this.user && this.props.onUserChange != undefined){
                //console.log("update user ",user);
                this.props.onUserChange(user);
                //console.log("update user done",user);
                this.user=user;
                //console.log("changed user:",this.user);
            }
            //console.log(this.user);
        }catch(ex){
            //console.log(this.props.onUserChange);
            console.log(ex.message);
        }
        
        this.setState({user,address,username});
    }

    constructor(props){
        super(props);
        this.user="";
        
        this.state={
            user:"",
            username:"",
            address:undefined
        };
        
    }
    componentDidMount() {
        //console.log(this.props.onUserChange);
        this.myTimer = setInterval(()=> {this.freshAcct()} , 2000);
    }

    componentWillUnmount()  {
        clearInterval(this.myTimer);
    }
    render() {
        return (
            //custom CSS should be in the javascript {} 
            <Menu style={{ marginTop: "10px" }}>

            <Link  route="/">
                <a className="item">Work Contract</a>     
            </Link>
                <Menu.Item name='user'>
                    <label>User: {this.state.username}</label>
                </Menu.Item>

                <Menu.Menu position='right'>


                    <Link route="/workcontract/new">
                        <a className="item"><Icon disabled name='add circle' /></a>
                    </Link>

                </Menu.Menu>
            </Menu>
        );
    }
}
export default Header;
/*
export default(props)=>{
    return (
        //custom CSS should be in the javascript {} 
        <Menu style={{marginTop:"10px"}}>
        
            <Link  route="/">
                <a className="item">Work Contract</a>     
            </Link>
            <Menu.Item name='user'>
                <label>User:</label>
                <Dropdown placeholder='Select user' fluid selection options={userOptions} 
                    value={props.user}
                    onChange={(e, data) => {
                        if(props.onUserChange!=null)
                            props.onUserChange(data.value);
                    }}
                     />
            </Menu.Item>

            <Menu.Menu position='right'>
                

                <Link route="/workcontract/new">
                    <a className="item"><Icon disabled name='add circle' /></a>
                </Link>
                
            </Menu.Menu>
        </Menu>
    );
};
*/