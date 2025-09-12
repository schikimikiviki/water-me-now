package com.plants.backend.service;

import com.plants.backend.data.entities.PlantTask;
import com.plants.backend.data.entities.Task;
import com.plants.backend.repository.TaskRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskReminderScheduler {

    @Value("${mailadressReceiver}")
    public String mailAdressToContact;

    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PlantTaskService plantTaskService;

    @Transactional
    @Scheduled(cron = "0 10 10 * * *") // Every day at 5 AM server time
    //  @Scheduled(cron = "0 */1 * * * *") // every 1 minute
    public void checkAndSendReminders() throws MessagingException {

        LocalDate today = LocalDate.now();
        System.out.println("Checking for tasks due on: " + today);
        List<Task> dueTasks = taskRepo.findByMonthAndDay(today.getMonthValue(), today.getDayOfMonth());

        System.out.println("Found " + dueTasks.size() + " tasks");

        if (!dueTasks.isEmpty()) {
            StringBuilder content = new StringBuilder();
            content.append("<html><body style='font-family: Arial, sans-serif; font-size: 14px;'>");
            content.append("<h2>\uD83C\uDF31 Today's plant tasks</h2>");

            for (Task task : dueTasks) {
                content.append("<p><b>")
                        .append(task.getName())
                        .append("</b> - ")
                        .append(task.getTodo())
                        .append("</p>");

                List<PlantTask> plantTasks = task.getPlantTasks();
                if (plantTasks != null && !plantTasks.isEmpty()) {
                    content.append("<ul>");
                    for (PlantTask pt : plantTasks) {
                        String plantName = pt.getPlant() != null ? pt.getPlant().getName() : "Plant " + pt.getId();
                        content.append("<li><b>").append(plantName).append("</b>: ").append(pt.getTodo()).append("</li>");
                    }
                    content.append("</ul>");
                }
            }

            content.append("</body></html>");


            emailService.sendTaskReminder(
                    mailAdressToContact,
                    "🌱 Plant Task Reminder for " + today.toString(),
                    content.toString()
            );
        }
    }
}
