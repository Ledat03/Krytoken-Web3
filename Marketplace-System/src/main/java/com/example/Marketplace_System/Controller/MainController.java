package com.example.Marketplace_System.Controller;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Arrays;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Marketplace_System.DTO.VerifiedSignature;
import com.example.Marketplace_System.DTO.VerifySignature;
import com.example.Marketplace_System.Model.Address;
import com.example.Marketplace_System.Service.AddressService;
import com.example.Marketplace_System.Service.AuthSignature;
import com.example.Marketplace_System.Service.GenerateJWT;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("api")
public class MainController {

    private final AddressService addressService;
    private final AuthSignature authSignature;
    private final JwtDecoder jwtDecoder;
    private final GenerateJWT generateJWT;

    public MainController(AddressService addressService, AuthSignature authSignature, JwtDecoder jwtDecoder, GenerateJWT generateJWT) {
        this.addressService = addressService;
        this.authSignature = authSignature;
        this.jwtDecoder = jwtDecoder;
        this.generateJWT = generateJWT;
    }

    @PostMapping("/check_user/{address}")
    public ResponseEntity<Object> checkUser(@PathVariable String address) {
        long nonce = new SecureRandom().nextLong(999999);
        Address Info = addressService.saveAddress(address, nonce);
        return ResponseEntity.ok().body(Info);

    }

    @PostMapping("/verify_signature")
    public ResponseEntity<?> verifySignature(@RequestBody VerifySignature verifySignature) throws Exception {
        return authSignature.verifySignature(verifySignature);
    }

    @PostMapping("/user/log_out")
    public ResponseEntity<?> logOut(HttpServletRequest httpServletRequest) throws Exception {
        Cookie[] cookies = httpServletRequest.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).body("Unauthenticated !!");
        }
        Jwt jwt = jwtDecoder.decode(Arrays.stream(cookies).filter(c -> c.getName().equals("refreshToken")).findFirst().map(Cookie::getValue).orElse(null));
        String address = jwt.getSubject();
        Address fetchAddress = addressService.findAddress(address);
        fetchAddress.setVerified(false);
        fetchAddress.setRefreshToken(null);
        addressService.saveAddress(address, fetchAddress.getNonce());
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", null).maxAge(0).httpOnly(true).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteCookie.toString()).body("Logout successfully !!");
    }

    @PostMapping("/user/refresh_token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) throws Exception {
        Instant instant = Instant.now();
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(403).body("Unauthenticated !!");
        }
        String refreshToken = Arrays.stream(cookies).filter(c -> c.getName().equals("refreshToken")).findFirst().map(Cookie::getValue).orElse(null);
        if (refreshToken == null) {
            return ResponseEntity.status(403).body("Unauthenticated !!");
        }
        Jwt jwtInfo = jwtDecoder.decode(refreshToken);
        if (jwtInfo.getExpiresAt() != null && jwtInfo.getExpiresAt().isBefore(instant)) {
            Address fetchAddress = addressService.findAddress(jwtInfo.getSubject());
            fetchAddress.setVerified(false);
            fetchAddress.setRefreshToken(null);
            addressService.updateAddress(fetchAddress);
            ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", null).maxAge(0).httpOnly(true).build();
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteCookie.toString()).body("Your refresh token is expired, please login again !!");
        }
        if (jwtInfo.getExpiresAt() != null && jwtInfo.getExpiresAt().isAfter(instant)) {
            String newAccessToken = generateJWT.generateAccessToken(jwtInfo.getSubject());
            VerifiedSignature verifiedSignature = new VerifiedSignature(jwtInfo.getSubject(), newAccessToken, true);
            return ResponseEntity.ok().body(verifiedSignature);
        }
        return ResponseEntity.status(403).body("Unauthenticated !!");
    }

    @PostMapping("/expiredToken")
    public ResponseEntity<?> expiredToken() {
        return ResponseEntity.status(200).body("Call Success !!");
    }
}
