package com.example.Marketplace_System.Service;

import com.example.Marketplace_System.DTO.VerifiedSignature;
import com.example.Marketplace_System.DTO.VerifySignature;
import com.example.Marketplace_System.Model.Address;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Keys;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.security.SignatureException;
import java.time.Instant;
import java.util.Arrays;
import java.util.Objects;

@Service
public class AuthSignature {
    private final AddressService addressService;
    private final GenerateJWT generateJWT;
    AuthSignature(AddressService addressService, GenerateJWT generateJWT){
        this.addressService = addressService;
        this.generateJWT = generateJWT;
    }
    @Value("${expired-time-refresh-token}")
    private long expiredRefreshToken;
    public ResponseEntity<?> verifySignature(VerifySignature verifySignature) throws SignatureException {
        Address address = addressService.findAddress(verifySignature.getAddress());
        if (Objects.isNull(address)) {
            return ResponseEntity.badRequest().body("Invalid address !!");
        }
        byte[] messageBytes = String.valueOf(verifySignature.getNonce()).getBytes(StandardCharsets.UTF_8);
        byte[] signatureByte = Numeric.hexStringToByteArray(verifySignature.getSignature());
        if (signatureByte.length != 65) {
            return ResponseEntity.status(401).body("Invalid signature !!");
        }
        byte v = signatureByte[64];
        if (v < 27) {
            v += 27;
        }
        Sign.SignatureData sigData = new Sign.SignatureData(
                v,
                Arrays.copyOfRange(signatureByte, 0, 32),
                Arrays.copyOfRange(signatureByte, 32, 64)
        );
        BigInteger publicKey = Sign.signedPrefixedMessageToKey(messageBytes, sigData);
        System.out.println("v : " + v);
        System.out.println("Raw message: " + new String(messageBytes, StandardCharsets.UTF_8));
        System.out.println("Signature: " + verifySignature.getSignature());
        String recoveredAddress = "0x" + Keys.getAddress(publicKey);
        Boolean isCorrect = Objects.equals(address.getAddress().toLowerCase(), recoveredAddress);
        if (isCorrect) {
            Instant instant = Instant.now();
            long newNonce = new SecureRandom().nextLong(999999);
            address.setNonce(newNonce);
            String jwtRefreshToken = generateJWT.generateRefreshToken(verifySignature.getAddress());
            String jwtAccessToken = generateJWT.generateAccessToken(verifySignature.getAddress());
            addressService.verifiedAddress(address.getAddress(),newNonce,jwtRefreshToken);
            ResponseCookie responseCookie = ResponseCookie.from("refreshToken",jwtRefreshToken).maxAge(expiredRefreshToken).httpOnly(true).build();
            VerifiedSignature verifiedSignature = new VerifiedSignature(address.getAddress(),jwtAccessToken,true);
            return ResponseEntity.status(200).header(HttpHeaders.SET_COOKIE,responseCookie.toString()).body(verifiedSignature);
        }
        return ResponseEntity.badRequest().body("Error Action !!!");
    }
}
