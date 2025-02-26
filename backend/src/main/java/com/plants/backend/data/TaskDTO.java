package com.plants.backend.data;
import java.time.LocalDate;

public class TaskDTO {
    private Long id;
    private String name;
    private String imageFile;
    private String todo;
    private LocalDate date;
    
    public Long getId () {
    	return id;
    }
    
    public void setId (Long id) {
    	this.id = id;
    }
    
    public String getName() {
    	return name;
    }
    
    public void setName(String name) {
    	this.name = name;
    }
    
    public String getImageFile () {
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
    
    public LocalDate getDate () {
    	return date;
    }
    
    public void setDate(LocalDate date) {
    	this.date = date;
    }
}