package com.example.hospital_management.config;

import com.example.hospital_management.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource()).and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
                // Public endpoints
                .antMatchers("/api/auth/**").permitAll()

                // Thymeleaf pages (keep working)
                .antMatchers("/", "/dashboard", "/patients/**", "/doctors/**",
                        "/appointments/**", "/records/**").permitAll()
                .antMatchers("/css/**", "/js/**", "/images/**").permitAll()

                // REST API role-based access
                .antMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/patients/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/patients/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/doctors/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/doctors/**").hasRole("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/appointments/**").hasAnyRole("ADMIN", "DOCTOR")
                .antMatchers(HttpMethod.PUT, "/api/appointments/**").hasAnyRole("ADMIN", "DOCTOR")
                .antMatchers(HttpMethod.POST, "/api/records/**").hasAnyRole("ADMIN", "DOCTOR")
                .antMatchers(HttpMethod.PUT, "/api/records/**").hasAnyRole("ADMIN", "DOCTOR")
                .antMatchers(HttpMethod.GET, "/api/**").authenticated()

                .anyRequest().permitAll()
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
