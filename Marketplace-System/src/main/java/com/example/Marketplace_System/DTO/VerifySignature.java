package com.example.Marketplace_System.DTO;

import lombok.Data;

@Data
public class VerifySignature {
    private long nonce;
    private String signature;
    private String address;
}
