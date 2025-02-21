package com.plants.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.plants.data.Plant;
import com.plants.data.PlantTask;
import com.plants.data.Task;
import com.plants.service.PlantTaskService;

@RestController
@RequestMapping("/plant-tasks")
public class PlantTaskController {



	private final PlantTaskService plantTaskService;


	public PlantTaskController(PlantTaskService plantTaskService) {
		this.plantTaskService = plantTaskService;
	}


	@GetMapping("/all")
	public List<PlantTask> getAllPlantTasks(){
		return plantTaskService.findAll();
	}

	@GetMapping("/id/{Id}")
	public Optional<PlantTask> getPlantTaskById(@PathVariable Long Id) {
		return plantTaskService.findPlantTaskById(Id);
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
