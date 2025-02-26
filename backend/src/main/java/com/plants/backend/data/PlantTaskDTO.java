package com.plants.backend.data;

public class PlantTaskDTO {
    private Long id;
    private TaskDTO task;
    
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public TaskDTO getTask() {
		return task;
	}
	public void setTask(TaskDTO task) {
		this.task = task;
	} 
    
    
}