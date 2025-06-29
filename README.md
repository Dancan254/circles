# Complete Flow for M-Pesa to Blockchain Integration
## 1. Initial User Request
1. The user initiates the process by providing:
    - Their phone number
    - Amount in KES they want to convert to crypto
    - Their crypto wallet address

2. This information is sent to the `/api/crypto/on-ramp` endpoint.

## 2. M-Pesa STK Push Initiation
1. The system receives the request and calls the `TransactionService.initiateOnRamp()` method.
2. This method:
    - Calls `MpesaService.initiateSTKPush()` to send the payment request to the user's phone
    - Creates a new `CryptoTransaction` record with status "PENDING"
    - Stores the transaction details including checkout request ID, phone number, amount, and wallet address
    - Returns the checkout request ID to the user

## 3. User Payment Confirmation
1. The user receives an STK push notification on their phone
2. They enter their M-Pesa PIN to authorize the payment
3. M-Pesa processes the payment (this happens on the M-Pesa side)

## 4. Automated Transaction Status Checking
1. The `TransactionStatusChecker` scheduler runs every minute
2. It retrieves all pending transactions from the database
3. For each pending transaction:
    - It calls `TransactionService.processTransaction()`
    - This method calls `MpesaService.queryTransactionStatus()` with the stored checkout request ID
    - The M-Pesa API returns the current status of the transaction

## 5. Transaction Status Processing
1. The system checks the result code from the status query:
    - If result code is "0" (success):
        - The system calls the `BlockchainService.creditWallet()` method
        - This method calculates the crypto amount based on the KES amount and exchange rate
        - It calls your blockchain smart contract to credit the user's wallet
        - Updates the transaction status to "COMPLETED" and marks it as processed

    - If the result code indicates failure:
        - The system updates the transaction status to "FAILED" and marks it as processed

    - If the transaction is still pending (no result code):
        - The system leaves the transaction as pending for the next check

## 6. Blockchain Smart Contract Execution
1. The `BlockchainService` connects to your blockchain network
2. It calls the appropriate smart contract function with:
    - The user's wallet address
    - The calculated crypto amount

3. The smart contract executes the transfer on the blockchain

## 7. Transaction Completion
1. The transaction is now complete:
    - The user has paid in KES via M-Pesa
    - The equivalent amount in crypto has been credited to their wallet
    - The transaction record is marked as processed with a completion timestamp
