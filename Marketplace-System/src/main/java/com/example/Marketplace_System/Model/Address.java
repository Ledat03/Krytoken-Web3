package com.example.Marketplace_System.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;

@Data
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long address_id;
    @NonNull
    private String address;
    private long nonce;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String refreshToken;
    private boolean isVerified;
    public Address() {

    }
}
