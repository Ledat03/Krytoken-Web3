package com.example.Marketplace_System.Service;

import com.example.Marketplace_System.Model.Address;
import com.example.Marketplace_System.Repository.addressRepository;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    private final addressRepository addressRepository;
    public AddressService(addressRepository addressRepository) {
        this.addressRepository = addressRepository;
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
}
