
#Finance Service
## Manage eCashOrder creation, asymmetric encryption, verification of digital signature

### Docker build
docker build -f Dockerfile.financeservice --tag p2pworkcontract/financeservice .
### Docker run
docker run -it -e PORT=8002 --rm -p 8002:8002 p2pworkcontract/financeservice