package com.example.Marketplace_System.Service;

import com.example.Marketplace_System.Model.Address;
import com.example.Marketplace_System.Repository.addressRepository;

import org.springframework.stereotype.Service;

import com.example.Marketplace_System.Model.Permission;
import com.example.Marketplace_System.Repository.permissionRepository;

@Service
public class AddressService {
    private final addressRepository addressRepository;
    private final permissionRepository permissionRepository;
    public AddressService(addressRepository addressRepository, permissionRepository permissionRepository) {
        this.addressRepository = addressRepository;
        this.permissionRepository = permissionRepository;
    }
    public Address findAddress(String address){
        return addressRepository.findByAddress(address);
    }
    public Address saveAddress(String address, long nonce){
        Address existAddress = addressRepository.findByAddress(address);
        if(existAddress != null){
            existAddress.setNonce(nonce);
            return addressRepository.save(existAddress);
        }else{
            Address newAddress = new Address();
            newAddress.setAddress(address);
            newAddress.setNonce(nonce);
            return addressRepository.save(newAddress);
        }
    }
    public Address updateAddress(Address address){
        return addressRepository.save(address);
    }
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
    public Permission savePermission(String address, long tokenAlowance, boolean nftAlowanceAll){
        Permission existPermission = permissionRepository.findByAddress(address);
        if(existPermission != null){
            existPermission.setTokenAlowance(tokenAlowance);
            existPermission.setNftAlowanceAll(nftAlowanceAll);
            return permissionRepository.save(existPermission);
        }else{
            Permission newPermission = new Permission();
            newPermission.setAddress(address);
            newPermission.setTokenAlowance(tokenAlowance);
            newPermission.setNftAlowanceAll(nftAlowanceAll);
            return permissionRepository.save(newPermission);
        }
    }
}
