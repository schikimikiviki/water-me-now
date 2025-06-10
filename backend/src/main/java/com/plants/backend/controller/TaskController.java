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

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantTask;
import com.plants.backend.data.PlantTaskDTO;
import com.plants.backend.data.Task;
import com.plants.backend.data.TaskDTO;
import com.plants.backend.repository.PlantTaskRepository;
import com.plants.backend.service.PlantService;
import com.plants.backend.service.TaskService;


@RestController
@RequestMapping("/tasks")
public class TaskController {



	private final TaskService taskService;
	private final PlantTaskRepository plantTaskRepository;
	private final PlantService plantService;


	public TaskController(TaskService taskService, PlantTaskRepository plantTaskRepository, PlantService plantService) {
		this.taskService = taskService;
		this.plantTaskRepository = plantTaskRepository;
		this.plantService = plantService;
	}


	@GetMapping("/all")
	public List<TaskDTO> getAllTasks(){
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
	

	 @PatchMapping(value = "/{taskId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
		public ResponseEntity<?> updateTask(
		        @PathVariable Long taskId,
		        @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
		        @RequestPart("taskBody") String taskBodyJson) {

		    System.out.println("Received PATCH request for taskId: " + taskId);
		    System.out.println("Received raw task body: " + taskBodyJson);


		    try {
		    	
		    	 ObjectMapper objectMapper = new ObjectMapper();
		    	 objectMapper.registerModule(new JavaTimeModule());
		    	 objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		    	 
		         TaskDTO taskDTO = objectMapper.readValue(taskBodyJson, TaskDTO.class);

		         System.out.println("Parsed DTO: " + taskDTO);
		         System.out.println("Date value: " + taskDTO.getDate());
		        
		         
		        // 1. Find existing pest
		        Optional<Task> existingTaskOpt = taskService.findTaskById(taskId);
		        if (!existingTaskOpt.isPresent()) {
		            return ResponseEntity.notFound().build();
		        }

		        Task existingTask = existingTaskOpt.get();

		        // 2. Handle Image Upload (only if new image provided)
		        if (imageFile != null && !imageFile.isEmpty()) {
		            // Delete old image if it exists
		            if (existingTask.getImageFile() != null) {
		                Path oldImagePath = Paths.get("uploads/" + existingTask.getImageFile());
		                Files.deleteIfExists(oldImagePath);
		            }

		            // Save new image
		            String uploadDir = "uploads/";
		            String imageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
		            Path imagePath = Paths.get(uploadDir + imageName);
		            Files.createDirectories(imagePath.getParent());
		            Files.write(imagePath, imageFile.getBytes());
		            existingTask.setImageFile(imageName);
		        }

		        // 3. Update task properties
		        if (taskDTO.getName() != null) {
		            existingTask.setName(taskDTO.getName());
		        }
		        if (taskDTO.getTodo() != null) {
		            existingTask.setTodo(taskDTO.getTodo());
		        }
		        if (taskDTO.getDate() != null) {
		        	System.out.println("Parsed Date: " + taskDTO.getDate());
		        	LocalDate localdate = taskDTO.getDate();
		        	

		        	existingTask.setDate(localdate);
		        }

		     
		        if (taskDTO.getPlantTasks() != null) {
		            existingTask.getPlantTasks().clear();
		            
		            for (PlantTaskDTO plantTaskDTO : taskDTO.getPlantTasks()) {
		                if (plantTaskDTO.getPlantId() == null) {
		                    throw new IllegalArgumentException("Plant ID cannot be null");
		                }
		                
		                Plant plant = plantService.findPlantById(plantTaskDTO.getPlantId())
		                    .orElseThrow();
		                
		                PlantTask plantTask = new PlantTask();
		                plantTask.setPlant(plant);
		                plantTask.setTask(existingTask);
		                plantTask.setTodo(StringUtils.defaultIfBlank(
		                    plantTaskDTO.getTodo(), 
		                    existingTask.getTodo()));
		                    
		                existingTask.getPlantTasks().add(plantTask);
		            }
		        }
		        

		        // 5. Save updated task
		        Task updatedTask = taskService.save(existingTask);

		        return ResponseEntity.ok(Map.of(
		                "success", true,
		                "task", updatedTask
		        ));
		    } catch (JsonProcessingException e) {
		        System.err.println("JSON parsing error: " + e.getMessage());
		        return ResponseEntity.badRequest().body("Invalid JSON format");
		    } catch (IOException e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                .body(Map.of(
		                        "success", false,
		                        "error", "File processing error: " + e.getMessage()
		                ));
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                .body(Map.of(
		                        "success", false,
		                        "error", "Server error: " + e.getMessage()
		                ));
		    } 
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
