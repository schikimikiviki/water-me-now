package com.plants.backend.controller;

import com.plants.backend.data.entities.Task;
import com.plants.backend.service.EmailService;
import com.plants.backend.service.TaskReminderScheduler;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test-mail")
public class MailTestController {

    private final EmailService emailService;
    private final TaskReminderScheduler taskReminderScheduler;

    @Value("${mailadressReceiver}")
    private String mailAdressToContact;

    public MailTestController(EmailService emailService, TaskReminderScheduler taskReminderScheduler) {
        this.emailService = emailService;
        this.taskReminderScheduler = taskReminderScheduler;
    }

    @GetMapping
    public String triggerMail() throws MessagingException {
        emailService.sendTaskReminder(mailAdressToContact, "test", "test");
        return "Mail sent!";
    }

    @GetMapping("/repeated-tasks")
    public List<Task> checkRepeatedTasks() throws MessagingException {

        List<Task> taskList = taskReminderScheduler.checkAndSendRepeatedReminders();
        return taskList;
    }

    @GetMapping("/normal-tasks")
    public List<Task> checkNormalTasks() throws MessagingException {

        List<Task> taskList = taskReminderScheduler.checkAndSendNormalReminders();
        return taskList;
    }

    @GetMapping("/current-tasks")
    public String checkTasks() throws MessagingException {

        taskReminderScheduler.checkAndSendReminders();
        return "Current mails sent!";
    }
}
