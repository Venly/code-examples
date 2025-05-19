# ERC20 Meta Transaction Example

Welcome to the ERC20 Transaction Example! This example demonstrates how to perform transfer with authorization and permit/transferFrom for ERC20 token transfers. Follow the steps below to set up and run the example.
More information for:
- Transfer with authorization - [Click Here](https://docs.venly.io/docs/gasless-tx-transfer-with-authorization-erc20)
- Permit/TransferFrom - [Click Here](https://docs.venly.io/docs/gasless-tx-permit-transferfrom-erc20)


## Setup

1. Open the `config.ts` file.

2. Supply the correct values for the following variables:
    - `API_ROOT`: The root URL of the API.
    - `BEARER_TOKEN`: The bearer token for authentication.

3. This code-example contains 2 different flows:
    - `TransactionFlow` is the more recent standard flow for EIP712 documents
    - `LegacyTransactionFlow` under the `legacy` dir is the flow with the legacy standard of EIP712 documents.

4. Depending on what you are implementing, open either `TransactionFlow` or `LegacyTransactionFlow` and replace the example values with the actual values from your account:
    - `chain`: The chain you are using to perform the transaction.
    - `userWallet`: The wallet of the user that holds the ERC20 token.
    - `payerWallet`: The wallet of the user paying for the ERC20 transfer transaction.
    - `token`: The token being transferred.
    - `toWalletAddress`: The address where the ERC20 token will be sent to.

## Running the Example

After setting up the configuration, you can run the example by executing the following command:

```bash
npm install

-- to run the Transfer With Authorization example
npm run start-transfer-with-authorization 

-- to run the Permit/Transfer from example
npm run start-permit-transfer-from

-- to run the Transfer With Authorization example (legacy)
npm run start-transfer-with-authorization-legacy

-- to run the Permit/Transfer from example (legacy)
npm run start-permit-transfer-from-legacy
