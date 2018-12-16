import React,{Component} from "react";
import { Container } from 'semantic-ui-react';
import Head from "next/head"; 


export default(props)=>{
    return(
        
        <Container>
            <head>
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
            </head>
            
            {props.children}
        </Container>
    );
};