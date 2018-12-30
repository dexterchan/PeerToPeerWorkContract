import React,{Component} from "react";
import { Container } from 'semantic-ui-react';
import Head from "next/head"; 
import Header from "./Header";

class Layout extends Component{
    constructor(props){
        super(props);
        this.state={
            user:""
        }
    }
    /*
    componentDidMount(){
        this.props.onUserChange("Layout testing user change feedback");
    }
    */
    render(){
        return(
        
            <Container>
                <head>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
                </head>
                
                <Header user={this.props.user}  onUserChange={  (user)=>{this.props.onUserChange(user)} }/>
                {this.props.children}
                
                
            </Container>
        );
    }
}
export default Layout;
/*
export default(props)=>{
    return(
        
        <Container>
            <head>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
            </head>
            
            <Header user={props.user}  onUserChange={props.onUserChange}/>
            {props.children}
            
            
        </Container>
    );
};*/