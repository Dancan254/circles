package com.javaguy.backend.controller;

import com.javaguy.backend.dto.AccessTokenResponse;
import com.javaguy.backend.dto.STKPushQueryResponse;
import com.javaguy.backend.dto.STKPushResponse;
import com.javaguy.backend.service.MpesaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/payments")
@Slf4j
public class MpesaController {

    private final MpesaService mpesaService;

    public MpesaController(MpesaService mpesaService) {
        this.mpesaService = mpesaService;
    }

    //generate access token endpoint
    @GetMapping("/access-token")
    public ResponseEntity<AccessTokenResponse> getAccessToken() {
        try {
            return ResponseEntity.ok(mpesaService.generateAccessToken());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //  stk push endpoint
    @PostMapping("/stk-push")
    public ResponseEntity<STKPushResponse> stkPush(@RequestBody Map<String, String> payload) {
        try {
            String phoneNumber = payload.get("phoneNumber");
            String amount = payload.get("amount");

            return ResponseEntity.ok(mpesaService.initiateSTKPush(phoneNumber, amount));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/transaction-status/{checkoutRequestId}")
    public ResponseEntity<STKPushQueryResponse> queryTransactionStatus(@PathVariable String checkoutRequestId) {
        try {
            return ResponseEntity.ok(mpesaService.queryTransactionStatus(checkoutRequestId));
        } catch (Exception e) {
            log.error("Error querying transaction status: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
