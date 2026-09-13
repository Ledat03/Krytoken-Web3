package com.example.Marketplace_System.Service;

import com.example.Marketplace_System.Model.Address;
import com.example.Marketplace_System.Repository.addressRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.Marketplace_System.Model.Permission;
import com.example.Marketplace_System.Repository.permissionRepository;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final addressRepository addressRepository;
    private final permissionRepository permissionRepository;

    public Address findAddress(String address){
        return addressRepository.findByAddress(address);
    }
    public Address saveAddress(Address address){
        return addressRepository.save(address);

    }
    @Transactional
    public Address updateAddress(Address address){
        return addressRepository.save(address);
    }
    @Transactional
    public void verifiedAddress(String address, long nonce, String refreshToken){
        Address existAddress = addressRepository.findByAddress(address);
        if(existAddress != null){
            existAddress.setRefreshToken(refreshToken);
            existAddress.setVerified(true);
            addressRepository.save(existAddress);
        }
    }
    public Permission findPermission(String address){
        try{
            return permissionRepository.findByAddress(address);
        }catch(Exception e){
            return null;
        }
    }
    @Transactional
    public Permission savePermission(String address, long tokenAlowance, boolean nftAlowanceAll){
        Permission existPermission = permissionRepository.findByAddress(address);
        if(existPermission != null){
            existPermission.setTokenAllowance(tokenAlowance);
            existPermission.setNftAllowanceAll(nftAlowanceAll);
            return permissionRepository.save(existPermission);
        }else{
            Permission newPermission = new Permission();
            newPermission.setAddress(address);
            newPermission.setTokenAllowance(tokenAlowance);
            newPermission.setNftAllowanceAll(nftAlowanceAll);
            return permissionRepository.save(newPermission);
        }
    }

}
