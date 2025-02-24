package com.plants.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
import com.plants.backend.repository.PestRepository;
import com.plants.backend.repository.PlantTaskRepository;
import com.plants.backend.service.PlantService;

@RestController
@RequestMapping("/plants")
public class PlantController {



	private final PlantService plantService;
	
	private final PlantTaskRepository plantTaskRepository;
	
	private final PestRepository pestRepository;


	public PlantController(PlantService plantService, PlantTaskRepository plantTaskRepository, PestRepository pestRepository) {
		this.plantService = plantService;
		this.plantTaskRepository = plantTaskRepository;
		this.pestRepository = pestRepository;
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
	
	
	 @RequestMapping(value = "/add", method = RequestMethod.POST) 
	public ResponseEntity<?> addPlant(
	    @RequestParam("name") String name,
	    @RequestParam("origin") String origin,
	    @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
	    @RequestParam("hardiness") Hardiness hardiness,
	    @RequestParam(value = "hardiness_info", required = false) String hardinessInfo,
	    @RequestParam("ideal_location") Ideal_location idealLocation,
	    @RequestParam("watering") Watering watering,
	    @RequestParam("soil_type") Soil_type soilType,
	    @RequestParam("perennial") Boolean perennial,
	    @RequestParam(value = "featureList", required = false) List<Feature> featureList,
	    @RequestParam("ideal_placement") Ideal_placement idealPlacement,
	    @RequestParam(value = "propagation", required = false) String propagation,
	    @RequestParam("fertilization_schedule") Fertilization_schedule fertilizationSchedule,
	    @RequestParam(value = "uses", required = false) List<String> uses,
	    @RequestParam(value = "plantTasks", required = false) List<Long> plantTaskIds,
	    @RequestParam(value = "commonPests", required = false) List<Long> commonPestIds
	) {
		 System.out.println("Received POST /plants/add");
	    try {
	        // 1. Handle Image Upload
	        String imageName = null;
	        if (imageFile != null && !imageFile.isEmpty()) {
	            String uploadDir = "uploads/";
	            imageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
	            Path imagePath = Paths.get(uploadDir + imageName);
	            Files.createDirectories(imagePath.getParent());
	            Files.write(imagePath, imageFile.getBytes());
	        }

	        // 2. Create Plant Object
	        Plant plant = new Plant();
	        plant.setName(name);
	        plant.setOrigin(origin);
	        plant.setImageFile(imageName);
	        plant.setHardiness(hardiness);
	        plant.setHardiness_info(hardinessInfo);
	        plant.setIdeal_location(idealLocation);
	        plant.setWatering(watering);
	        plant.setSoil_type(soilType);
	        plant.setPerennial(perennial);
	        plant.setFeatureList(featureList != null ? featureList : new ArrayList<>());
	        plant.setIdeal_placement(idealPlacement);
	        plant.setPropagation(propagation);
	        plant.setFertilization_schedule(fertilizationSchedule);
	        plant.setUses(uses != null ? uses : new ArrayList<>());
	        // 3. Fetch Common Pests by IDs
	        if (commonPestIds != null && !commonPestIds.isEmpty()) {
	            List<Common_pest> commonPests = commonPestIds.stream()
	                .map(id -> pestRepository.findById(id).orElse(null))
	                .filter(Objects::nonNull)
	                .collect(Collectors.toList());
	            plant.setCommonPests(commonPests);
	        }
	        
	        System.out.println("Common Pests: " + plant.getCommonPests());


	        // 3. Handle Plant Tasks
	        if (plantTaskIds != null && !plantTaskIds.isEmpty()) {
	            List<PlantTask> tasks = plantTaskIds.stream()
	                .map(id -> plantTaskRepository.findById(id).orElse(null))
	                .filter(Objects::nonNull)
	                .collect(Collectors.toList());
	            plant.setPlantTasks(tasks);
	        }

	        // 4. Save Plant
	        plantService.save(plant);

	        return ResponseEntity.ok(Map.of("success", true, "plant", plant));
	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "error", e.getMessage()));
	    }
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
