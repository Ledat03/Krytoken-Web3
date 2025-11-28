package com.example.Marketplace_System.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerifiedSignature {
    private String address;
    private String accessToken;
    private boolean isVerified;
    private long nonce;
}
