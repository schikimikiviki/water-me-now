package com.plants.backend;


import jakarta.persistence.EntityManagerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;


@EnableJpaRepositories(basePackages = "com.plants.backend.repository")
@EntityScan("com.plants.backend.data")
@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    public static void main(String[] args) {


        int x;
        x = 24;
        byte b = x;
        //SpringApplication.run(BackendApplication.class, args);
    }

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

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

}
