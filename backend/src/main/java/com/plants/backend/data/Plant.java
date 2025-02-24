package com.plants.backend.data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "plants")
public class Plant {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String name;
	private String origin; 
	private String imageFile; 
	@Enumerated(EnumType.STRING)
	private Hardiness hardiness; 
	private String hardiness_info; 
	@Enumerated(EnumType.STRING)
	private Ideal_location ideal_location; 
	@Enumerated(EnumType.STRING)
	private Watering watering; 
	@Enumerated(EnumType.STRING)
	private Soil_type soil_type; 
	private Boolean perennial; 
	@ElementCollection
	@Enumerated(EnumType.STRING)
	private List<Feature> featureList;
	@Enumerated(EnumType.STRING)
	private Ideal_placement ideal_placement;
	private String propagation;
	@Enumerated(EnumType.STRING)
	private Fertilization_schedule fertilization_schedule;
	
	@ManyToMany
	@JoinTable(
	    name = "plant_companions",
	    joinColumns = @JoinColumn(name = "plant_id"),
	    inverseJoinColumns = @JoinColumn(name = "companion_id")
	)
	private List<Plant> companionPlants;

	@ElementCollection
	private List<String> uses;
	
	
	@ManyToMany(mappedBy = "plantList", fetch = FetchType.EAGER)
	@JsonManagedReference
	private List<Common_pest> commonPests;

	@OneToMany(mappedBy = "plant", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PlantTask> plantTasks;

	public Plant() {}
	
	public Plant (Long id, String name, String origin, String imageFile, Hardiness hardiness, String hardiness_info, Ideal_location ideal_location, Watering watering, Soil_type soil_type, List<Feature> featureList, Ideal_placement ideal_placement, String propagation, Fertilization_schedule fertilization_schedule, List<Plant> companionPlants, List<String> uses, List<Common_pest> commonPests, List<PlantTask> plantTasks) {
		super();
		this.id = id;
		this.name=name;
		this.origin=origin;
		this.imageFile = imageFile;
		this.hardiness = hardiness;
		this.hardiness_info = hardiness_info;
		this.ideal_location = ideal_location;
		this.watering = watering;
		this.soil_type = soil_type;
		this.featureList = featureList;
		this.ideal_placement = ideal_placement;
		this.propagation = propagation;
		this.fertilization_schedule = fertilization_schedule;
		this.companionPlants = companionPlants;
		this.uses = uses;
		this.commonPests = commonPests;
		this.plantTasks = plantTasks;
		
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

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getImageFile() {
		return imageFile;
	}

	public void setImageFile(String imageFile) {
		this.imageFile = imageFile;
	}

	public Hardiness getHardiness() {
		return hardiness;
	}

	public void setHardiness(Hardiness hardiness) {
		this.hardiness = hardiness;
	}

	public String getHardiness_info() {
		return hardiness_info;
	}

	public void setHardiness_info(String hardiness_info) {
		this.hardiness_info = hardiness_info;
	}

	public Ideal_location getIdeal_location() {
		return ideal_location;
	}

	public void setIdeal_location(Ideal_location ideal_location) {
		this.ideal_location = ideal_location;
	}

	public Watering getWatering() {
		return watering;
	}

	public void setWatering(Watering watering) {
		this.watering = watering;
	}

	public Soil_type getSoil_type() {
		return soil_type;
	}

	public void setSoil_type(Soil_type soil_type) {
		this.soil_type = soil_type;
	}

	public Boolean getPerennial() {
		return perennial;
	}

	public void setPerennial(Boolean perennial) {
		this.perennial = perennial;
	}

	public List<Feature> getFeatureList() {
		return featureList;
	}

	public void setFeatureList(List<Feature> featureList) {
		this.featureList = featureList;
	}

	public Ideal_placement getIdeal_placement() {
		return ideal_placement;
	}

	public void setIdeal_placement(Ideal_placement ideal_placement) {
		this.ideal_placement = ideal_placement;
	}

	public String getPropagation() {
		return propagation;
	}

	public void setPropagation(String propagation) {
		this.propagation = propagation;
	}

	public Fertilization_schedule getFertilization_schedule() {
		return fertilization_schedule;
	}

	public void setFertilization_schedule(Fertilization_schedule fertilization_schedule) {
		this.fertilization_schedule = fertilization_schedule;
	}

	public List<Plant> getCompanionPlants() {
		return companionPlants;
	}

	public void setCompanionPlants(List<Plant> compagnionPlants) {
		this.companionPlants = compagnionPlants;
	}

	public List<String> getUses() {
		return uses;
	}

	public void setUses(List<String> uses) {
		this.uses = uses;
	}

	public List<Common_pest> getCommonPests() {
		return commonPests;
	}

	public void setCommonPests(List<Common_pest> commonPests) {
		this.commonPests = commonPests;
	}

	public List<PlantTask> getPlantTaskList() {
		return plantTasks;
	}

	public void setPlantTasks(List<PlantTask> plantTasks) {
		this.plantTasks = plantTasks;
	}
	
}