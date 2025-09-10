package com.plants.backend.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.plants.backend.data.enums.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinTable(
            name = "plant_companions",
            joinColumns = @JoinColumn(name = "plant_id"),
            inverseJoinColumns = @JoinColumn(name = "companion_id")
    )
    @JsonManagedReference
    private List<Plant> companionPlants = new ArrayList<>();

    @ElementCollection
    private List<String> uses;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "plant_pests",
            joinColumns = @JoinColumn(name = "plant_id"),
            inverseJoinColumns = @JoinColumn(name = "pest_id")
    )
    @JsonManagedReference
    private List<Common_pest> commonPests;


    @OneToMany(mappedBy = "plant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PlantTask> plantTasks = new ArrayList<>();

    private Boolean isAlive;

    private String extraInfo;

    private Boolean isVegetable;

    @Enumerated(EnumType.STRING)
    private SeedTime seedTime;

    @Enumerated(EnumType.STRING)
    private List<HarvestTime> harvestTimes;

    @Enumerated(EnumType.STRING)
    private List<TrimmingTime> trimmingTimes;

    public Plant() {
    }

    public Plant(Long id, String name, String origin, String imageFile, Hardiness hardiness, String hardiness_info, Ideal_location ideal_location, Watering watering, Soil_type soil_type, List<Feature> featureList, Ideal_placement ideal_placement, String propagation, Fertilization_schedule fertilization_schedule, List<Plant> companionPlants, List<String> uses, List<Common_pest> commonPests, List<PlantTask> plantTasks, Boolean perennial, Boolean isAlive, String extraInfo, Boolean isVegetable, SeedTime seedTime, List<TrimmingTime> trimmingTimes, List<HarvestTime> harvestTimes) {
        super();
        this.id = id;
        this.name = name;
        this.origin = origin;
        this.imageFile = imageFile;
        this.hardiness = hardiness;
        this.hardiness_info = hardiness_info;
        this.ideal_location = ideal_location;
        this.watering = watering;
        this.soil_type = soil_type;
        this.perennial = perennial;
        this.featureList = featureList;
        this.ideal_placement = ideal_placement;
        this.propagation = propagation;
        this.fertilization_schedule = fertilization_schedule;
        this.companionPlants = companionPlants;
        this.uses = uses;
        this.commonPests = commonPests;
        this.plantTasks = plantTasks;
        this.isAlive = isAlive;
        this.extraInfo = extraInfo;
        this.isVegetable = isVegetable;
        this.seedTime = seedTime;
        this.harvestTimes = harvestTimes;
        this.trimmingTimes = trimmingTimes;

    }

    public Boolean getIsVegetable() {
        return isVegetable;
    }

    public void setIsVegetable(Boolean isVegetable) {
        this.isVegetable = isVegetable;
    }

    public SeedTime getSeedTime() {
        return seedTime;
    }

    public void setSeedTime(SeedTime seedTime) {
        this.seedTime = seedTime;
    }

    public List<HarvestTime> getHarvestTimes() {
        return harvestTimes;
    }

    public void setHarvestTimes(List<HarvestTime> harvestTimes) {
        this.harvestTimes = harvestTimes;
    }

    public List<TrimmingTime> getTrimmingTimes() {
        return trimmingTimes;
    }

    public void setTrimmingTimes(List<TrimmingTime> trimmingTimes) {
        this.trimmingTimes = trimmingTimes;
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

    public List<PlantTask> getPlantTasks() {
        return plantTasks;
    }

    public void setPlantTasks(List<PlantTask> plantTasks) {
        this.plantTasks = plantTasks;
    }

}