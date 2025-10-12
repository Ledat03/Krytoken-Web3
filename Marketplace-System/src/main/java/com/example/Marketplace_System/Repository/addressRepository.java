package com.example.Marketplace_System.Repository;

import com.example.Marketplace_System.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface addressRepository extends JpaRepository<Address, Long>{
    Address findByAddress(String address);
    Address save(Address address);
}
