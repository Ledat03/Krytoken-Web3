package com.example.Marketplace_System.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Table;

@Entity
@Table(name = "permissions")
@Data
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String address;
    private long tokenAlowance;
    private boolean nftAlowanceAll;
}
