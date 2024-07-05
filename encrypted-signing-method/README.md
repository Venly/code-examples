# ERC721 Meta Transaction Example

Welcome to the ERC721 Meta Transaction Example! This example demonstrates how to perform meta-transactions for ERC721 token transfers and is based on a Venly ERC115 contract that implements the ERC721 standard (example contract [here](https://mumbai.polygonscan.com/address/0x80E64e1AAa57034CA0561288449B2FE9687a94a8). Follow the steps below to set up and run the example.

## Setup

1. Open the `config.ts` file.

2. Supply the correct values for the following variables:
    - `API_ROOT`: The root URL of the API.
    - `BEARER_TOKEN`: The bearer token for authentication.

3. Open the `index.ts` file.

4. Replace the example values with the actual values from your account:
    - `signingMethodInput`: The signing method input of the user.
    - `requestBody`: The transaction request body, similar to the example provided.

## Running the Example

After setting up the configuration, you can run the example by executing the following command:

```bash
npm install
npm run start
