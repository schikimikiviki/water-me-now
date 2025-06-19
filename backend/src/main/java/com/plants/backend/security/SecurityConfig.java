package com.plants.backend.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	 private final AuthenticationProvider authenticationProvider;
	 
	 public SecurityConfig(
		        JwtAuthenticationFilter jwtAuthenticationFilter,
		        AuthenticationProvider authenticationProvider
		    ) {
		        this.authenticationProvider = authenticationProvider;
		        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		    }

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		
		http.csrf(csrf -> csrf.disable())
		
		.cors(cors -> cors.configurationSource(corsConfigurationSource()))
		.exceptionHandling(ex -> ex
	            .authenticationEntryPoint((request, response, authException) -> {
	                System.out.println("Authentication failed: " + authException.getMessage());
	                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
	            })
	        )
        .authorizeHttpRequests(authz -> authz
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/auth/login").permitAll()
            .requestMatchers("/auth/check").authenticated()
            
			.requestMatchers("/plants/all").permitAll()
			.requestMatchers("/uploads/**").permitAll()
			.requestMatchers("/tasks/all").permitAll()
			.requestMatchers("/plant-tasks/all").permitAll()
			.requestMatchers("/pests/all").permitAll()
			
						 
            .anyRequest().authenticated() 
        )
				/*
				 * .sessionManagement(session -> session
				 * .sessionCreationPolicy(SessionCreationPolicy.STATELESS) )
				 */
        .sessionManagement(session -> session
        	    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
        	)

        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .httpBasic(httpp -> httpp.disable());


		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
	    configuration.setAllowedMethods(Arrays.asList("GET","POST","PUT", "PATCH","DELETE","OPTIONS"));
	    configuration.setAllowedHeaders(Arrays.asList("*"));
	    configuration.setAllowCredentials(true);
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
	
	
	
	 

	
}
