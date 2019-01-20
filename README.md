

#Peer to Peer Front end
## host webpage to help user access DApp hosted in the Ethereum network
## Also, it serves as the gateway to connect to internal Finance Service which manage eCashOrder

### Docker build
docker build -f Dockerfile.PeerToPeerFrontEnd --tag p2pworkcontract/peer2peerfrontend .

### Docker run
ENV variable
RUN_DEV - point to finance service URI 
default -> http://localhost:8001/api/ecashorder
SIT -> http://192.168.1.251:8001/api/ecashorder
UAT -> http://dexcloudapp.xyz:8001/api/ecashorder

docker run -it -e PORT=8080 -e RUN_DEV=UAT --rm -p 8080:8080 p2pworkcontract/peer2peerfrontend

#Finance Service
## Manage eCashOrder creation, asymmetric encryption, verification of digital signature

Env variable
financeService_jwtPrivateKey - jwt private key

### Docker build
docker build -f Dockerfile.financeservice --tag p2pworkcontract/financeservice .
### Docker run
docker run -it -e PORT=8001 --rm -p 8001:8001 p2pworkcontract/financeservice


## dependency on MONGO
Run the Mongo for holding user credential
Setup mongo instance by docker container
docker pull mongo
docker run -it --rm -p:27017:27017 mongo
