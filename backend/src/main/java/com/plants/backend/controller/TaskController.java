package com.plants.backend.controller;

import java.time.LocalDate;
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

import com.plants.backend.data.PlantTask;
import com.plants.backend.data.Task;
import com.plants.backend.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {



	private final TaskService taskService;


	public TaskController(TaskService taskService) {
		this.taskService = taskService;
	}


	@GetMapping("/all")
	public List<Task> getAllTasks(){
		return taskService.findAll();
	}

	@GetMapping("/id/{Id}")
	public Optional<Task> getTaskById(@PathVariable Long Id) {
		return taskService.findTaskById(Id);
	}
	

	@PatchMapping("/{taskId}")
	public ResponseEntity<Task> editTask(@PathVariable Long taskId, @RequestBody Map<String, Object> updates) {
	    Optional<Task> foundTaskOptional = taskService.findTaskById(taskId);

	    if (foundTaskOptional.isPresent()) {
	        Task foundTask = foundTaskOptional.get();

	        updates.forEach((key, value) -> {
	            switch (key) {
	                case "name":
	                	foundTask.setName((String) value);
	                    break;
	                case "imageFile":
	                	foundTask.setImageFile((String) value);
	                    break;
	                case "todo":
	                	foundTask.setTodo((String) value);
	                case "plantTasks":
	                	foundTask.setPlantTasks((List<PlantTask>) value);
	                case "date":
	                	foundTask.setDate((LocalDate) value);
	                default:
	                    throw new IllegalArgumentException("Invalid field: " + key);
	            }
	        });

	        Task updatedTask = taskService.save(foundTask);
	        return ResponseEntity.ok(updatedTask);
	    }

	    return ResponseEntity.notFound().build();
	}

	


	@DeleteMapping("/{taskId}")
	public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
		try {
			taskService.deleteTaskById(taskId);
			return ResponseEntity.ok(Map.of("success", true, "message", "Task deleted successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success", false, "message", "Task not found"));
		}
	}

}
