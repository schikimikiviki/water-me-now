package com.plants.backend;


import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import jakarta.persistence.EntityManagerFactory;



@EnableJpaRepositories(basePackages = "com.plants.backend.repository")
@EntityScan("com.plants.backend.data") 
@SpringBootApplication
public class BackendApplication {
	
	@Bean
	public ApplicationRunner applicationRunner(ApplicationContext context) {
	    return args -> {
	        System.out.println("🚀 Mapped Endpoints:");
	        context.getBeansOfType(RequestMappingHandlerMapping.class)
	               .forEach((name, mapping) -> mapping.getHandlerMethods()
	                   .forEach((key, value) -> System.out.println(key)));
	    };
	}
	
	@Bean
	public CommandLineRunner checkEntities(EntityManagerFactory emf) {
	    return args -> {
	        System.out.println("📋 Loaded Entities:");
	        emf.getMetamodel().getEntities()
	            .forEach(entity -> System.out.println("✅ " + entity.getName()));
	    };
	}



	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
