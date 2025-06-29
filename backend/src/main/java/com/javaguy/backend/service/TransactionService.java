package com.javaguy.backend.service;

import com.javaguy.backend.dto.STKPushResponse;
import com.javaguy.backend.dto.STKPushQueryResponse;
import com.javaguy.backend.model.CryptoTransaction;
import com.javaguy.backend.repository.CryptoTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionService {

    private final MpesaService mpesaService;
    private final BlockchainService blockchainService;
    private final CryptoTransactionRepository transactionRepository;

    /**
     * Initiates the on-ramp process by sending an STK push and saving the transaction
     *
     * @param phoneNumber User's phone number
     * @param amountKES Amount in KES
     * @param walletAddress User's crypto wallet address
     * @return The checkout request ID
     */
    @Transactional
    public String initiateOnRamp(String phoneNumber, Double amountKES, String walletAddress) {
        try {
            log.info("Initiating on-ramp for phone: {}, amount: {}, wallet: {}",
                    phoneNumber, amountKES, walletAddress);

            // Initiate STK push
            STKPushResponse stkResponse = mpesaService.initiateSTKPush(
                    phoneNumber, String.valueOf(amountKES.intValue()));

            // Save transaction details
            CryptoTransaction transaction = new CryptoTransaction();
            transaction.setPhoneNumber(phoneNumber);
            transaction.setAmountKES(amountKES);
            transaction.setWalletAddress(walletAddress);
            transaction.setCheckoutRequestId(stkResponse.getCheckoutRequestID());
            transaction.setTransactionStatus("PENDING");

            transactionRepository.save(transaction);

            return stkResponse.getCheckoutRequestID();
        } catch (IOException e) {
            log.error("Error initiating on-ramp: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initiate on-ramp", e);
        }
    }

    /**
     * Processes a transaction by checking its status and crediting the wallet if successful
     *
     * @param transaction The transaction to process
     * @return true if processed successfully, false otherwise
     */
    @Transactional
    public boolean processTransaction(CryptoTransaction transaction) {
        try {
            log.info("Processing transaction with checkoutRequestId: {}",
                    transaction.getCheckoutRequestId());

            // Query transaction status
            STKPushQueryResponse queryResponse = mpesaService.queryTransactionStatus(
                    transaction.getCheckoutRequestId());

            // Check if transaction was successful (0 is success code)
            if (queryResponse.getResultCode() != null && queryResponse.getResultCode().equals("0")) {
                log.info("Transaction successful, crediting wallet");

                // Call blockchain service to credit wallet
                boolean credited = blockchainService.creditWallet(
                        transaction.getWalletAddress(), transaction.getAmountKES());

                if (credited) {
                    transaction.setTransactionStatus("COMPLETED");
                    transaction.setProcessed(true);
                    transaction.setProcessedAt(LocalDateTime.now());
                    transactionRepository.save(transaction);
                    return true;
                } else {
                    log.error("Failed to credit wallet for transaction: {}",
                            transaction.getCheckoutRequestId());
                    return false;
                }
            } else {
                // If result code indicates failure or transaction is still pending
                if (queryResponse.getResultCode() != null) {
                    transaction.setTransactionStatus("FAILED");
                    transaction.setProcessed(true);
                    transaction.setProcessedAt(LocalDateTime.now());
                    transactionRepository.save(transaction);
                }
                return false;
            }
        } catch (IOException e) {
            log.error("Error processing transaction: {}", e.getMessage(), e);
            return false;
        }
    }
}