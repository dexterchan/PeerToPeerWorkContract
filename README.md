
docker build -f Dockerfile.financeservice --tag p2pworkcontract/financeservice .

docker run -it --rm -p 8001:8001 p2pworkcontract/financeservice