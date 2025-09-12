package com.plants.backend.service;

import com.plants.backend.data.entities.PlantTask;
import com.plants.backend.data.entities.Task;
import com.plants.backend.data.enums.Repetition;
import com.plants.backend.repository.TaskRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
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
        List<Task> finalTasks = new ArrayList<>();

        // first, check if there are any repeated tasks
        List<Task> repeatedTasks = taskRepo.findByIsRepeated();

        for (Task task : repeatedTasks) {
            Repetition repetition = task.getRepetition();

            if (repetition == Repetition.DAILY) {
                // always include
                finalTasks.add(task);

            } else if (repetition == Repetition.MONTHLY) {
                // send only if it's the 1st of the month
                if (today.getDayOfMonth() == 1) {
                    finalTasks.add(task);
                }

            } else if (repetition == Repetition.WEEKLY) {
                // send only if it's Sunday
                if (today.getDayOfWeek() == DayOfWeek.SUNDAY) {
                    finalTasks.add(task);
                }
            }
        }


        System.out.println("Checking for tasks due on: " + today);
        List<Task> dueTasks = taskRepo.findByMonthAndDay(today.getMonthValue(), today.getDayOfMonth());

        finalTasks.addAll(dueTasks);

        System.out.println("Found " + finalTasks.size() + " tasks");

        if (!finalTasks.isEmpty()) {
            StringBuilder content = new StringBuilder();
            content.append("<html><body style='font-family: Arial, sans-serif; font-size: 14px;'>");
            content.append("<h2>\uD83C\uDF31 Today's plant tasks</h2>");

            for (Task task : finalTasks) {
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


    public List<Task> checkAndSendRepeatedReminders() throws MessagingException {

        // first, check if there are any repeated tasks
        List<Task> repeatedTasks = taskRepo.findByIsRepeated();

        return repeatedTasks;


    }

    public List<Task> checkAndSendNormalReminders() throws MessagingException {

        LocalDate today = LocalDate.now();
        System.out.println("Checking for tasks due on: " + today);
        List<Task> dueTasks = taskRepo.findByMonthAndDay(today.getMonthValue(), today.getDayOfMonth());

        return dueTasks;


    }

}
