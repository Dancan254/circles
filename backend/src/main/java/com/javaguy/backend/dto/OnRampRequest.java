package com.javaguy.backend.dto;

import lombok.Data;

@Data
public class OnRampRequest {
    private String phoneNumber;
    private Double amountKES;
    private String walletAddress;
}
