package com.javaguy.backend.scheduler;

import com.javaguy.backend.model.CryptoTransaction;
import com.javaguy.backend.repository.CryptoTransactionRepository;
import com.javaguy.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@EnableScheduling
@Slf4j
@RequiredArgsConstructor
public class TransactionStatusChecker {

    private final CryptoTransactionRepository transactionRepository;
    private final TransactionService transactionService;

    /**
     * Scheduled task to check pending transactions
     * Runs every 5 seconds
     */
    @Scheduled(fixedRate = 5000L)
    public void checkPendingTransactions() {
        log.info("Checking pending transactions");

        List<CryptoTransaction> pendingTransactions = transactionRepository.findPendingTransactions();

        log.info("Found {} pending transactions", pendingTransactions.size());

        for (CryptoTransaction transaction : pendingTransactions) {
            try {
                transactionService.processTransaction(transaction);
            } catch (Exception e) {
                log.error("Error processing transaction {}: {}",
                        transaction.getCheckoutRequestId(), e.getMessage(), e);
            }
        }
    }
}