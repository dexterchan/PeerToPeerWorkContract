FROM node:10.15.0-stretch-slim

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/FinanceService

ENV PATH /usr/src/app/FinanceService:/usr/local/bin:$PATH
ENV DEBUG app:error

RUN cd /usr/src/app
RUN mkdir -p /usr/src/app/FinanceService
RUN mkdir -p /usr/src/app/KeyVault
RUN mkdir -p /usr/src/app/KeyVault/keys
COPY FinanceService /usr/src/app/FinanceService
COPY KeyVault /usr/src/app/KeyVault
COPY CryptoWrapper /usr/src/app/CryptoWrapper
RUN rm -Rf /usr/src/app/FinanceService/node_modules/
RUN rm -Rf /usr/src/app/KeyVault/node_modules/
RUN rm -f /usr/src/app/FinanceService/package-lock.json
RUN rm -f /usr/src/app/KeyVault/package-lock.json
WORKDIR /usr/src/app/KeyVault
RUN cd /usr/src/app/KeyVault

RUN npm install
WORKDIR /usr/src/app/FinanceService
RUN cd /usr/src/app/FinanceService
RUN npm install


CMD ["npm","start"]
