package com.plants.backend.data;

public class PlantTaskDTO {
    private Long plantId;
    private String todo;

    
    
	public Long getPlantId() {
		return plantId;
	}
	public void setPlantId(Long plantId) {
		this.plantId = plantId;
	}
	
	public String getTodo() {
		return todo; 
	}
	
	public void setTodo(String todo)
    {
		this.todo = todo;
    }
	
}