package com.example.Marketplace_System.Service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class GenerateJWT {

    JwsHeader generateHeader = JwsHeader.with(SignatureAlgorithm.RS256).build();
    @Value("${expired-time-access-token}")
    private long accessTokenExpertTime;
    @Value("${expired-time-refresh-token}")
    private long refreshTokenExpertTime;
    private final JwtEncoder jwtEncoder;

    public GenerateJWT(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateAccessToken(String address) {
        Instant instant = Instant.now();
        Instant expiredTime = instant.plusSeconds(accessTokenExpertTime);
        JwtClaimsSet claimsSet = JwtClaimsSet.builder().issuedAt(instant).expiresAt(expiredTime).subject(address).claim("address", address).claim("type", "access_Token").build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(generateHeader, claimsSet)).getTokenValue();
    }

    public String generateRefreshToken(String address) {
        Instant instant = Instant.now();
        Instant expiredTime = instant.plusSeconds(refreshTokenExpertTime);
        JwtClaimsSet claims = JwtClaimsSet.builder().subject(address).issuedAt(instant).expiresAt(expiredTime).claim("address", address).claim("type", "refresh_Token").build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(generateHeader, claims)).getTokenValue();
    }
}
