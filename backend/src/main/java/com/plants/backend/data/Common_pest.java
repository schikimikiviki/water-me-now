package com.plants.backend.data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "common_pests")
public class Common_pest {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name; 
	private String imageFile; 
	private String todo; 
	@ManyToMany
	
	@JoinTable(
	    name = "plant_pests",
	    joinColumns = @JoinColumn(name = "pest_id"),
	    inverseJoinColumns = @JoinColumn(name = "plant_id")
	)
	@JsonIgnore
	
	private List<Plant> plantList;
	
	public Common_pest() {}

	
	public Common_pest (Long id, String name, String imageFile, String todo, List<Plant> plantList) {
		super();
		this.id = id;
		this.name = name;
		this.imageFile = imageFile;
		this.todo = todo;
		this.plantList = plantList;
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

	public List<Plant> getPlantList() {
		return plantList;
	}

	public void setPlantList(List<Plant> plantList) {
		this.plantList = plantList;
	}
}