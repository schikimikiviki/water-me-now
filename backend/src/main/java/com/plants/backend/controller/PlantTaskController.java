package com.plants.backend.controller;

import com.plants.backend.data.entities.Plant;
import com.plants.backend.data.entities.PlantTask;
import com.plants.backend.data.entities.Task;
import com.plants.backend.service.PlantTaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/plant-tasks")
public class PlantTaskController {


    private final PlantTaskService plantTaskService;


    public PlantTaskController(PlantTaskService plantTaskService) {
        this.plantTaskService = plantTaskService;
    }


    @GetMapping("/all")
    public List<PlantTask> getAllPlantTasks() {
        return plantTaskService.findAll();
    }

    @GetMapping("/id/{Id}")
    public Optional<PlantTask> getPlantTaskById(@PathVariable Long Id) {
        return plantTaskService.findPlantTaskById(Id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPlantTask(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Received POST /plant-tasks/add");

        Long taskId = Long.valueOf(requestBody.get("task").toString());
        Long plantId = Long.valueOf(requestBody.get("plant").toString());
        String todo = requestBody.get("todo").toString();

        // Find the task
        Task task = plantTaskService.findTaskForPlantTask(taskId)
                .orElseThrow(() -> new RuntimeException("Task with ID " + taskId + " not found"));

        // Find the plant
        Plant plant = plantTaskService.findPlantForPlantTask(plantId)
                .orElseThrow(() -> new RuntimeException("Plant with ID " + plantId + " not found"));

        // Create and save PlantTask
        PlantTask plantTask = new PlantTask(plant, task, todo);
        plantTaskService.save(plantTask);

        return ResponseEntity.ok(Map.of("success", true, "plantTask", plantTask));
    }


    @PatchMapping("/{taskId}")
    public ResponseEntity<PlantTask> editTask(@PathVariable Long taskId, @RequestBody Map<String, Object> updates) {
        Optional<PlantTask> foundPlantTaskOptional = plantTaskService.findPlantTaskById(taskId);

        if (foundPlantTaskOptional.isPresent()) {
            PlantTask foundPlantTask = foundPlantTaskOptional.get();

            updates.forEach((key, value) -> {
                switch (key) {

                    case "todo":
                        foundPlantTask.setTodo((String) value);
                    case "plant":
                        foundPlantTask.setPlant((Plant) value);
                    case "task":
                        foundPlantTask.setTask((Task) value);
                    default:
                        throw new IllegalArgumentException("Invalid field: " + key);
                }
            });

            PlantTask updatedPlantTask = plantTaskService.save(foundPlantTask);
            return ResponseEntity.ok(updatedPlantTask);
        }

        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{plantTaskId}")
    public ResponseEntity<?> deletePlantTask(@PathVariable Long plantTaskId) {
        try {
            plantTaskService.deletePlantTaskById(plantTaskId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Plant Task deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Plant Task not found"));
        }
    }

}
