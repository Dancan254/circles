package com.javaguy.backend.controller;

import com.javaguy.backend.dto.OnRampRequest;
import com.javaguy.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/crypto")
@Slf4j
@RequiredArgsConstructor
public class CryptoController {

    private final TransactionService transactionService;

    @PostMapping("/on-ramp")
    public ResponseEntity<String> initiateOnRamp(@RequestBody OnRampRequest request) {
        try {
            String checkoutRequestId = transactionService.initiateOnRamp(
                    request.getPhoneNumber(), request.getAmountKES(), request.getWalletAddress());

            return ResponseEntity.ok(checkoutRequestId);
        } catch (Exception e) {
            log.error("Error initiating on-ramp: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}