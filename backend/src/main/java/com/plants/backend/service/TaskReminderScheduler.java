package com.plants.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.plants.backend.data.Task;
import com.plants.backend.repository.TaskRepository;

@Service
public class TaskReminderScheduler {
	
	@Value("${mailadressReceiver}")
    private String mailAdressToContact;

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 7 * * *") // Every day at 7 AM server time
  //  @Scheduled(cron = "0 */1 * * * *") // every 1 minute
    public void checkAndSendReminders() {
    	
    	
        LocalDate today = LocalDate.now();
        
        System.out.println("Checking for tasks due on: " + today);
        List<Task> dueTasks = taskRepo.findByDate(today);
        System.out.println("Found " + dueTasks.size() + " tasks");

        if (!dueTasks.isEmpty()) {
            StringBuilder content = new StringBuilder("Today's plant tasks:\n\n");
            for (Task task : dueTasks) {
                content.append("- ").append(task.getTodo()).append("\n");
            }

            
            emailService.sendTaskReminder(
            		mailAdressToContact, 
                "🌱 Plant Task Reminder for " + today.toString(), 
                content.toString()
            );
        }
    }
}
