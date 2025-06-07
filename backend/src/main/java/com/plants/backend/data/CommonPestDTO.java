package com.plants.backend.data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CommonPestDTO {
    private Long id;
    
    
    private String name;
    private String imageFile;
    
    @JsonProperty("todo")
    private String todo;
    
    private List<Long> plantList;
    
    public CommonPestDTO(){
    }
    
    public CommonPestDTO(Common_pest pest) {
        this.id = pest.getId();
        this.name = pest.getName();
        this.imageFile = pest.getImageFile();
        this.todo = pest.getTodo();
        this.plantList = pest.getPlantList() != null
            ? pest.getPlantList().stream().map(Plant::getId).collect(Collectors.toList())
            : new ArrayList<>();
    }
   
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
	
	public List<Long> getPlantList(){
		return plantList;
	}
	public void setPlantList(List<Long> plantList) {
		this.plantList = plantList;
	}
   
	
    
    
}