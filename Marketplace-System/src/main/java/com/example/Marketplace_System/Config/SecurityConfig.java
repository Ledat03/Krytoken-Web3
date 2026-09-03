    package com.example.Marketplace_System.Config;

    import java.io.IOException;
    import java.security.NoSuchAlgorithmException;
    import java.security.spec.InvalidKeySpecException;
    import java.util.List;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.oauth2.jwt.JwtDecoder;
    import org.springframework.security.oauth2.jwt.JwtEncoder;
    import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
    import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;

    import com.example.Marketplace_System.Service.SwapTypeService;
    import com.nimbusds.jose.jwk.JWKSet;
    import com.nimbusds.jose.jwk.RSAKey;
    import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
    import com.nimbusds.jose.jwk.source.JWKSource;
    import com.nimbusds.jose.proc.SecurityContext;

    @Configuration
    @EnableMethodSecurity(securedEnabled = true)
    @EnableWebSecurity
    public class SecurityConfig {

        private final SwapTypeService swapTypeService;

        public SecurityConfig(SwapTypeService swapTypeService1) {
            this.swapTypeService = swapTypeService1;
        }

        @Bean
        public JwtDecoder jwtDecoder() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
            return NimbusJwtDecoder.withPublicKey(swapTypeService.rsaPublicKey()).build();
        }

        @Bean
        public JwtEncoder jwtEncoder() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
            RSAKey rsaKey = new RSAKey.Builder(swapTypeService.rsaPublicKey()).privateKey(swapTypeService.rsaPrivateKey()).build();
            JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(new JWKSet(rsaKey));
            return new NimbusJwtEncoder(jwkSource);
        }

        @Bean
        public SecurityFilterChain configSecurityFilterChain(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(authorRequest -> authorRequest.requestMatchers("/api/verify_signature","/api/user/log_out/**", "/api/check_user/**").permitAll()
                            .anyRequest().authenticated())
                    .formLogin(AbstractHttpConfigurer::disable)
                    .cors(configurer -> configurer.configurationSource(request -> {
                CorsConfiguration corsConfiguration = new CorsConfiguration();
                corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000"));
                corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                corsConfiguration.setAllowCredentials(true);
                corsConfiguration.addAllowedHeader("*");
                corsConfiguration.addExposedHeader("Set-Cookie");
                return corsConfiguration;
            }))
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .oauth2ResourceServer(oauth2 -> oauth2
                            .jwt(jwt -> {
                try {
                    jwt.decoder(jwtDecoder());
                } catch (IOException ex) {
                } catch (NoSuchAlgorithmException ex) {
                } catch (InvalidKeySpecException ex) {
                }
            })
                                    .authenticationEntryPoint((request, response, authException) -> {
                                        String path = request.getRequestURI();
                                        if (path.startsWith("/api/user/log_out") ||
                                                path.startsWith("/api/check_user")) {
                                            response.setStatus(200);
                                            return;
                                        }
                                        response.setStatus(401);
                                        response.getWriter().write("Unauthorize !");
                                    })

                    );

            return http.build();
        }

    }
