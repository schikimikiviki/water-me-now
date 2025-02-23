package com.plants.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.plants.backend.data.Common_pest;
import com.plants.backend.data.Feature;
import com.plants.backend.data.Fertilization_schedule;
import com.plants.backend.data.Hardiness;
import com.plants.backend.data.Ideal_location;
import com.plants.backend.data.Ideal_placement;
import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantTask;
import com.plants.backend.data.Soil_type;
import com.plants.backend.data.Watering;
import com.plants.backend.service.PlantService;

@RestController
@RequestMapping("/plants")
public class PlantController {



	private final PlantService plantService;


	public PlantController(PlantService plantService) {
		this.plantService = plantService;
	}


	@GetMapping("/all")
	public List<Plant> getAllPlants() {
		// Return list of users from the database
		return plantService.findAll();
	}

	@GetMapping("/id/{Id}")
	public Optional<Plant> getPlantById(@PathVariable Long Id) {
		// Return details of a single user
		return plantService.findPlantById(Id);
	}
	

	@PatchMapping("/{plantId}")
	public ResponseEntity<Plant> editPlant(@PathVariable Long plantId, @RequestBody Map<String, Object> updates) {
	    Optional<Plant> foundPlantOptional = plantService.findPlantById(plantId);

	    if (foundPlantOptional.isPresent()) {
	        Plant foundPlant = foundPlantOptional.get();

	        updates.forEach((key, value) -> {
	            switch (key) {
	                case "name":
	                    foundPlant.setName((String) value);
	                    break;
	                case "origin":
	                    foundPlant.setOrigin((String) value);
	                    break;
	                case "imageFile":
	                    foundPlant.setImageFile((String) value);
	                    break;
	                case "hardiness":
	                    foundPlant.setHardiness(Hardiness.valueOf((String) value));
	                    break;
	                case "hardiness_info":
	                    foundPlant.setHardiness_info((String) value);
	                    break;
	                case "ideal_location":
	                    foundPlant.setIdeal_location(Ideal_location.valueOf((String) value));
	                    break;
	                case "watering":
	                    foundPlant.setWatering(Watering.valueOf((String) value));
	                    break;
	                case "soil_type":
	                    foundPlant.setSoil_type(Soil_type.valueOf((String) value));
	                    break;
	                case "featureList":
	                    foundPlant.setFeatureList((List<Feature>) value);
	                    break;
	                case "ideal_placement":
	                    foundPlant.setIdeal_placement(Ideal_placement.valueOf((String) value));
	                    break;
	                case "propagation":
	                    foundPlant.setPropagation((String) value);
	                    break;
	                case "fertilization_schedule":
	                    foundPlant.setFertilization_schedule(Fertilization_schedule.valueOf((String) value));
	                    break;
	                case "companionPlants":
	                    foundPlant.setCompanionPlants((List<Plant>) value);
	                    break;
	                case "uses":
	                    foundPlant.setUses((List<String>) value);
	                    break;
	                case "commonPests":
	                    foundPlant.setCommonPests((List<Common_pest>) value);
	                    break;
	                case "plantTasks":
	                    foundPlant.setPlantTasks((List<PlantTask>) value);
	                    break;
	                default:
	                    throw new IllegalArgumentException("Invalid field: " + key);
	            }
	        });

	        Plant updatedPlant = plantService.save(foundPlant);
	        return ResponseEntity.ok(updatedPlant);
	    }

	    return ResponseEntity.notFound().build();
	}

	


	@DeleteMapping("/{plantId}")
	public ResponseEntity<?> deletePlant(@PathVariable Long plantId) {
		try {
			plantService.deletePlantById(plantId);
			return ResponseEntity.ok(Map.of("success", true, "message", "Plant deleted successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success", false, "message", "Plant not found"));
		}
	}

}
