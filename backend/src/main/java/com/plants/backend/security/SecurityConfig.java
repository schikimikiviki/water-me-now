package com.plants.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;




@Configuration
@EnableWebSecurity
public class SecurityConfig {


	@Bean
	public static PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	
	  @Bean public AuthenticationManager
	  authenticationManager(AuthenticationConfiguration authConfig) throws
	  Exception { return authConfig.getAuthenticationManager(); }
	 
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
		

		.csrf(csrf -> csrf.disable()).securityMatcher("/**"). authorizeHttpRequests((authz) ->  authz
				
		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
		.requestMatchers("/plants/all").anonymous()
		.requestMatchers(HttpMethod.POST, "/plants/add").authenticated()
		.requestMatchers("/plants/**").authenticated()
		
		.requestMatchers(HttpMethod.POST, "/users/login").permitAll()
		.requestMatchers("/users/**").authenticated() 
		.requestMatchers("/test").anonymous()
		
		.requestMatchers("/tasks/all").anonymous() 
		.requestMatchers("/tasks/**").authenticated() 
		
		.requestMatchers("/plant-tasks/all").anonymous()
		.requestMatchers("/plant-tasks/**").authenticated()
		
		.requestMatchers("/pests/all").anonymous() 
		.requestMatchers("/pests/**").authenticated() 
		
		


		.anyRequest().authenticated())
		.httpBasic(Customizer.withDefaults());

		return http.build();
	}

	
	
	  @Bean public UserDetailsService userDetailsService(PasswordEncoder
	  passwordEncoder) { UserDetails admin = User.withUsername("admin")
	  .password(passwordEncoder.encode("admin")).roles("USER",
	  "ADMIN") .build();
	  
	  UserDetails user = User.withUsername("user")
	  .password(passwordEncoder.encode("user")) // Encode password .roles("USER")
	  .build();
	  
	  return new InMemoryUserDetailsManager(admin, user); }
	 

	
}
