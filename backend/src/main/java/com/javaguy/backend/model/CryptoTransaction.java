package com.javaguy.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CryptoTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phoneNumber;
    private Double amountKES;
    private String walletAddress;
    private String checkoutRequestId;
    private String transactionStatus; // PENDING, COMPLETED, FAILED
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
    private Boolean processed = false;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}