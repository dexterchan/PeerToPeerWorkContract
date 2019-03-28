# Peer to Peer Front end

## host webpage to help user access DApp hosted in the Ethereum network

## Also, it demonstrated the marriage of dencentralized app and traditional centralized finance system as storage of secret inside a smart contract

## Using Smart COntract to attract sharp brain working with us

Sharp brains will become more important from now. For example, AI field.....
THose sharp brains may not be interested to stay in ONE firm for long time. After interesting project finished, they would seek for other opportunities. THe work relationship with the sharp brain may not be the same as employer-employee relationship as today.

The form would evolve to Partnership.

Trust is critical to form partnership. However, we need to go through lots of paper work to protect, for example:

- Time on paper work to onboard and offboard talents
- Hiree to get paid (no need to worry sustain cut of funding )
- Hirer to get service (evidence for dispute when hiree failed to deliver work in quality)

What make this project different from other Peer-to-Peer Work contract on Ethereum?
Most work contract in Ethereum is using Ethereum as medium of payment of work....
After the job is done, hiree will get the Ethereum from the contract....
However, at project closing, does the same Ethereum value (vs Fiat currency : USD, EUR) have the same equivalent value as the start of the project?
Note: Ethereum price can be up or down 20% of USD in a single trading day.

## Use of fiat currency with Ethereum smart contract

Here, we solve the problem of how to apply Fiat currency as payment without using any Crypto, including ERC20 Stablecoin.....

Ethereum is only for transaction fee....

It would solve problem of today working contract of small projects from grass root in the society.... No more depending on piece of paper or verbral agreement in 21st century.....

## How it works?

The storage of payment is in the form of ecash order... (electronic form of draft demand)...
The person holding the ecash order is able to withdraw the fiat moeny stated in the ecash order.

Therefore, we need to have some way to protect the ecash order as encrypted form.

Hirer first deposit the encrypted ecash order written by the financial institution. (Note: Financial institution would provide forward payment loan to the hirer...)

Ecash order is encrypted by a symmetric key and digitially signed by financial institution.
Public key of hirer encrypts the symmetric key.

Inside the Smart Contract, hiree can check the validity of the ecashorder on the smart contract by checking the signature.

After the project finish, hirer can trigger the ownership transfer of the symmetric key by

- decrypting the symmetric key by his/her private key
- encrypting the symmetric key by hiree's public key
  In this way, hiree can get the symmetric key to decrypt the ecash order for payment.

Therefore, the encrypted ecash order remains the same (the same symmetric key) during the project for any validation at any time.

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
