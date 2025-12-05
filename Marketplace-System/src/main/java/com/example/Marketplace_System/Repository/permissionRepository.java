package com.example.Marketplace_System.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Marketplace_System.Model.Permission;

public interface permissionRepository extends JpaRepository<Permission, Integer>{
    Permission save(Permission permission);
    Permission findByAddress(String address);
}
