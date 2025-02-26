package com.plants.backend.data;

import java.util.List;

public class PlantDTO {
    private Long id;
    private String name;
    private String origin;
    private String imageFile;
    private Hardiness hardiness;
    private String hardiness_info;
    private Ideal_location ideal_location;
    private Watering watering;
    private Soil_type soil_type;
    private Boolean perennial;
    private List<Feature> featureList;
    private Ideal_placement ideal_placement;
    private String propagation;
    private Fertilization_schedule fertilization_schedule;
    private List<Plant> companionPlants;
    private List<String> uses;
    private List<CommonPestDTO> commonPests;
    private List<PlantTaskDTO> plantTasks; 
    
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
	public void setCompanionPlants(List<Plant> companionPlants) {
		this.companionPlants = companionPlants;
	}
	public List<String> getUses() {
		return uses;
	}
	public void setUses(List<String> uses) {
		this.uses = uses;
	}
	public List<CommonPestDTO> getCommonPests() {
		return commonPests;
	}
	public void setCommonPests(List<CommonPestDTO> commonPests) {
		this.commonPests = commonPests;
	}
	public List<PlantTaskDTO> getPlantTasks() {
		return plantTasks;
	}
	public void setPlantTasks(List<PlantTaskDTO> plantTasks) {
		this.plantTasks = plantTasks;
	}

    
    
}