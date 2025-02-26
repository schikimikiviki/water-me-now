package com.plants.backend.data;

import java.util.List;

public class CommonPestDTO {
    private Long id;
    private String name;
    private String imageFile;
    
    private String todo;
    private List<Plant> plantList;
    
    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
    
	public String getImageFile() {
		return imageFile;
	}
	public void setImageFile(String imageFile) {
		this.imageFile = imageFile;
	}
	
	public String getTodo() {
		return todo;
	}
	
	public void setTodo(String todo) {
		this.todo = todo;
	}
	
	public List<Plant> getPlantList(){
		return plantList;
	}
	public void setPlantList(List<Plant> plantList) {
		this.plantList = plantList;
	}
   
	
    
    
}