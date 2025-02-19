package com.plants.data;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class Task {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name; 
	private String imageFile; 
	private String todo; 
	@OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PlantTask> plantTasks;

	private LocalDate date;
	
	public Task() {}
	
	public Task(Long id, String name, String imageFile, String todo, List<PlantTask> plantTasks, LocalDate date) {
		super();
		this.id = id;
		this.name = name;
		this.imageFile = imageFile;
		this.todo = todo;
		this.plantTasks = plantTasks;
		this.date = date;
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

	public List<PlantTask> getPlantTaskList() {
		return plantTasks;
	}

	public void setPlantList(List<PlantTask> plantTasks) {
		this.plantTasks = plantTasks;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}
	
}