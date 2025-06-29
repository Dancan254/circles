package com.javaguy.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class STKPushQueryRequest {
    @JsonProperty("BusinessShortCode")
    private String businessShortCode;
    @JsonProperty("Password")
    private String password;
    @JsonProperty("Timestamp")
    private String timestamp;
    @JsonProperty("CheckoutRequestID")
    private String checkoutRequestID;
}