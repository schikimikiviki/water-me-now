package com.plants.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.plants.backend.service.EmailService;

@RestController
@RequestMapping("/test-mail")
public class MailTestController {

    private final EmailService emailService;
    
	@Value("${mailadressReceiver}")
    private String mailAdressToContact;

    public MailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public String triggerMail() {
        emailService.sendTaskReminder(mailAdressToContact, "test", "test");
        return "Mail sent!";
    }
}
