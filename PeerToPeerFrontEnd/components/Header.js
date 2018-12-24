import React,{Component} from "react";
import { Menu,Icon,Dropdown } from 'semantic-ui-react';
import {Link} from "../routes";
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

class Header {
    status={
        user:null
    };


    render() {
        return (
            //custom CSS should be in the javascript {} 
            <Menu style={{ marginTop: "10px" }}>

                <Link route="/">
                    <a className="item">Projects</a>
                </Link>
                <Menu.Item name='user'>
                    <label>User:</label>
                    <Dropdown placeholder='Select user' fluid selection options={userOptions} value={this.state.user}
                        onChange={(e, data) => {
                            this.setState({ user: data.value });
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
    }
}


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