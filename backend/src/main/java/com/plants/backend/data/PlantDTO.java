package com.plants.backend.data;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @JsonProperty("featureList")
    private List<Feature> featureList;
    private Ideal_placement ideal_placement;
    private String propagation;
    private Fertilization_schedule fertilization_schedule;

    @JsonProperty("companionPlants")
    private List<Long> companionPlants;
    private List<String> uses;

    @JsonProperty("commonPests")
    private List<Long> commonPests;

    @JsonProperty("plantTasks")
    private List<PlantTaskDTO> plantTasks;

    private Boolean isAlive;
    private String extraInfo;

    public PlantDTO() {
    }


    public PlantDTO(Plant plant) {
        this.id = plant.getId();
        this.name = plant.getName();
        this.imageFile = plant.getImageFile();
        this.origin = plant.getOrigin();
        this.hardiness = plant.getHardiness();
        this.hardiness_info = plant.getHardiness_info();
        this.ideal_location = plant.getIdeal_location();
        this.watering = plant.getWatering();
        this.soil_type = plant.getSoil_type();
        this.perennial = plant.getPerennial();
        this.featureList = plant.getFeatureList();
        this.ideal_placement = plant.getIdeal_placement();
        this.fertilization_schedule = plant.getFertilization_schedule();
        this.propagation = plant.getPropagation();
        this.uses = plant.getUses();

        this.companionPlants = plant.getCompanionPlants() != null ? plant.getCompanionPlants().stream().map(Plant::getId).collect(Collectors.toList())
                : new ArrayList<>();

        this.commonPests = plant.getCommonPests() != null ? plant.getCommonPests().stream().map(Common_pest::getId).collect(Collectors.toList())
                : new ArrayList<>();

        this.plantTasks = plant.getPlantTasks() != null ?
                plant.getPlantTasks().stream().map(plantTask -> {
                    PlantTaskDTO dto = new PlantTaskDTO();
                    dto.setPlantId(plantTask.getPlant() != null ? plantTask.getPlant().getId() : null);
                    dto.setTodo(plantTask.getTodo());
                    return dto;
                }).collect(Collectors.toList()) :
                new ArrayList<>();
        this.isAlive = plant.getIsAlive();
        this.extraInfo = plant.getExtraInfo();
    }

    public Boolean getIsAlive() {
        return isAlive;
    }

    public void setIsAlive(Boolean isAlive) {
        this.isAlive = isAlive;
    }

    public String getExtraInfo() {
        return extraInfo;
    }

    public void setExtraInfo(String extraInfo) {
        this.extraInfo = extraInfo;
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

    public List<Long> getCompanionPlants() {
        return companionPlants;
    }

    public void setCompanionPlants(List<Long> companionPlants) {
        this.companionPlants = companionPlants;
    }

    public List<String> getUses() {
        return uses;
    }

    public void setUses(List<String> uses) {
        this.uses = uses;
    }

    public List<Long> getCommonPests() {
        return commonPests;
    }

    public void setCommonPests(List<Long> commonPests) {
        this.commonPests = commonPests;
    }

    public List<PlantTaskDTO> getPlantTasks() {
        return plantTasks;
    }

    public void setPlantTasks(List<PlantTaskDTO> plantTasks) {
        this.plantTasks = plantTasks;
    }


}