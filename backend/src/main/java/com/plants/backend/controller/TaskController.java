package com.plants.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.plants.backend.data.PlantTask;
import com.plants.backend.data.Task;
import com.plants.backend.repository.PlantTaskRepository;
import com.plants.backend.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {



	private final TaskService taskService;
	private final PlantTaskRepository plantTaskRepository;


	public TaskController(TaskService taskService, PlantTaskRepository plantTaskRepository) {
		this.taskService = taskService;
		this.plantTaskRepository = plantTaskRepository;
	}


	@GetMapping("/all")
	public List<Task> getAllTasks(){
		return taskService.findAll();
	}

	@GetMapping("/id/{Id}")
	public Optional<Task> getTaskById(@PathVariable Long Id) {
		return taskService.findTaskById(Id);
	}
	

	 @RequestMapping(value = "/add", method = RequestMethod.POST) 
	public ResponseEntity<?> addTask(
	    @RequestParam("name") String name,
	    @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
	    
	    @RequestParam("todo") String todo,
	   
	    @RequestParam("date") LocalDate localdate,
	
	    @RequestParam(value = "plantList", required = false) List<Long> plantIds
	) {
		 System.out.println("Received POST /tasks/add");
	    try {
	        // 1. Handle Image Upload
	        String imageName = null;
	        if (imageFile != null && !imageFile.isEmpty()) {
	            String uploadDir = "uploads/";
	            imageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
	            Path imagePath = Paths.get(uploadDir + imageName);
	            Files.createDirectories(imagePath.getParent());
	            Files.write(imagePath, imageFile.getBytes());
	        }

	        // 2. Create  Object
	        
	        Task task = new Task();
	        task.setName(name);
	        task.setImageFile(imageName);
	        task.setTodo(todo);
	        task.setDate(localdate);
	        

	        // 3. Handle Plant Tasks
	        if (plantIds != null && !plantIds.isEmpty()) {
	            List<PlantTask> tasks = plantIds.stream()
	                .map(id -> plantTaskRepository.findById(id).orElse(null))
	                .filter(Objects::nonNull)
	                .collect(Collectors.toList());
	            task.setPlantTasks(tasks);
	        }

	        // 4. Save Plant
	        taskService.save(task);

	        return ResponseEntity.ok(Map.of("success", true, "task", task));
	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "error", e.getMessage()));
	    }
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
