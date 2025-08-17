package com.plants.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.plants.backend.data.DTOMapper;
import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantTask;
import com.plants.backend.data.PlantTaskDTO;
import com.plants.backend.data.Task;
import com.plants.backend.data.TaskDTO;
import com.plants.backend.repository.PlantRepository;
import com.plants.backend.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final PlantRepository plantRepository;


    public TaskService(TaskRepository taskRepository, PlantRepository plantRepository) {
        this.taskRepository = taskRepository;
        this.plantRepository = plantRepository;
    }

    public List<TaskDTO> findAll() {
		/* return taskRepository.findAll(); */
    	return taskRepository.findAll().stream()
                .map(DTOMapper::toTaskDTO)
                .collect(Collectors.toList());
    }
   
    
    public Task save(Task task) {
    	return taskRepository.save(task);
    }
    
    public Optional<Task> findTaskById (Long id) {
    	return taskRepository.findById(id);
    }

    public void deleteTaskById(Long id) {
    	taskRepository.deleteById(id);
    }
    
    public List<Task> findTasksForToday() {
        LocalDate today = LocalDate.now();
        List<Task> allTasks = taskRepository.findAll();
        return allTasks.stream()
                .filter(task -> task.getDate().getMonth() == today.getMonth() &&
                                task.getDate().getDayOfMonth() == today.getDayOfMonth())
                .toList();
    }


    public Task updateTask(Long taskId, TaskDTO taskDTO) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow();
        
        // Update basic fields
        if (taskDTO.getName() != null) task.setName(taskDTO.getName());
        if (taskDTO.getTodo() != null) task.setTodo(taskDTO.getTodo());
        if (taskDTO.getDate() != null) task.setDate(taskDTO.getDate());
        
        // Handle plant tasks
        if (taskDTO.getPlantTasks() != null) {
            // Clear existing tasks
            task.getPlantTasks().clear();
            
            // Add new tasks
            for (PlantTaskDTO ptDto : taskDTO.getPlantTasks()) {
                Plant plant = plantRepository.findById(ptDto.getPlantId())
                    .orElseThrow();
                
                PlantTask plantTask = new PlantTask();
                plantTask.setPlant(plant);
                plantTask.setTodo(ptDto.getTodo());
                task.addPlantTask(plantTask); // Use the helper method
            }
        }
        
        return taskRepository.save(task);
    }

   
    
   

	
}
