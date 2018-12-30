

#Peer to Peer Front end
## host webpage to help user access DApp hosted in the Ethereum network
## Also, it serves as the gateway to connect to internal Finance Service which manage eCashOrder

### Docker build


#Finance Service
## Manage eCashOrder creation, asymmetric encryption, verification of digital signature

### Docker build
docker build -f Dockerfile.financeservice --tag p2pworkcontract/financeservice .
### Docker run
docker run -it -e PORT=8002 --rm -p 8002:8002 p2pworkcontract/financeservice