package com.javaguy.backend.repository;

import com.javaguy.backend.model.CryptoTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CryptoTransactionRepository extends JpaRepository<CryptoTransaction, Long> {
    List<CryptoTransaction> findByProcessedFalseAndTransactionStatus(String status);

    @Query("SELECT c FROM CryptoTransaction c WHERE c.processed = false AND c.checkoutRequestId IS NOT NULL")
    List<CryptoTransaction> findPendingTransactions();

}
