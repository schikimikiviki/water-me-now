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

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.plants.backend.data.Common_pest;
import com.plants.backend.data.Feature;
import com.plants.backend.data.Fertilization_schedule;
import com.plants.backend.data.Hardiness;
import com.plants.backend.data.Ideal_location;
import com.plants.backend.data.Ideal_placement;
import com.plants.backend.data.Plant;
import com.plants.backend.data.PlantDTO;
import com.plants.backend.data.PlantTask;
import com.plants.backend.data.PlantTaskDTO;
import com.plants.backend.data.Soil_type;
import com.plants.backend.data.Task;
import com.plants.backend.data.Watering;
import com.plants.backend.repository.PestRepository;
import com.plants.backend.repository.PlantRepository;
import com.plants.backend.repository.PlantTaskRepository;
import com.plants.backend.service.PlantService;
import com.plants.backend.service.TaskService;

@RestController
@RequestMapping("/plants")
public class PlantController {



	private final PlantService plantService;
	
	private final PlantTaskRepository plantTaskRepository;
	
	private final PestRepository pestRepository;
	
	private final PlantRepository plantRepository; 
	
	private final TaskService taskService; 


	public PlantController(PlantService plantService, PlantTaskRepository plantTaskRepository, PestRepository pestRepository, PlantRepository plantRepository, TaskService taskService) {
		this.plantService = plantService;
		this.plantTaskRepository = plantTaskRepository;
		this.pestRepository = pestRepository;
		this.plantRepository = plantRepository; 
		this.taskService = taskService;
	}


	@GetMapping("/all")
	public List<PlantDTO> getAllPlants() {
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
	    @RequestParam(value = "commonPests", required = false) List<Long> commonPestIds,
	    @RequestParam(value = "companionPlants", required = false) List<Long> companionPlantIds,
	    @RequestPart(value = "plantTasks", required = false) List<PlantTaskDTO> plantTasks
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

	        if (companionPlantIds != null && !companionPlantIds.isEmpty()) {
	        	  // set compagnion Plats
				List<Plant> plants = plantRepository.findAllById(companionPlantIds);	  
				System.out.println("plants"+ plants);
				plant.setCompanionPlants(plants);
	        }
	      
			
		
	        // 4. Save Plant
	        plantService.save(plant);
	        

	        return ResponseEntity.ok(Map.of("success", true, "plant", plant));
	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "error", e.getMessage()));
	    }
	}

	 @PatchMapping(value = "/{plantId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
		public ResponseEntity<?> updatePlant(
		        @PathVariable Long plantId,
		        @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
		        @RequestPart("plantBody") String plantBodyJson) {

		    System.out.println("Received PATCH request for pestId: " + plantId);
		    System.out.println("Received raw plantBody: " + plantBodyJson);


		    try {
		    	
		    	 ObjectMapper objectMapper = new ObjectMapper();
		        PlantDTO plantDTO = objectMapper.readValue(plantBodyJson, PlantDTO.class);

		       
		        // 1. Find existing pest
		        Optional<Plant> existingPlantOpt = plantService.findPlantById(plantId);
		        if (!existingPlantOpt.isPresent()) {
		            return ResponseEntity.notFound().build();
		        }

		        Plant existingPlant = existingPlantOpt.get();

		        // 2. Handle Image Upload (only if new image provided)
		        if (imageFile != null && !imageFile.isEmpty()) {
		            // Delete old image if it exists
		            if (existingPlant.getImageFile() != null) {
		                Path oldImagePath = Paths.get("uploads/" + existingPlant.getImageFile());
		                Files.deleteIfExists(oldImagePath);
		            }

		            // Save new image
		            String uploadDir = "uploads/";
		            String imageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
		            Path imagePath = Paths.get(uploadDir + imageName);
		            Files.createDirectories(imagePath.getParent());
		            Files.write(imagePath, imageFile.getBytes());
		            existingPlant.setImageFile(imageName);
		        }

		        // 3. Update pest properties
		        if (plantDTO.getName() != null) {
		            existingPlant.setName(plantDTO.getName());
		        }
		        
		        if (plantDTO.getOrigin() != null ) {
		        	existingPlant.setOrigin(plantDTO.getOrigin());
		        }
		       
		        if(plantDTO.getHardiness() != null) {
		        	existingPlant.setHardiness(plantDTO.getHardiness());
		        }
		        
		        if (plantDTO.getHardiness_info() != null) {
		        	existingPlant.setHardiness_info(plantDTO.getHardiness_info());
		        }
		        
		        if (plantDTO.getWatering() != null) {
		        	existingPlant.setWatering(plantDTO.getWatering());
		        }
		        
		        if (plantDTO.getSoil_type() != null) {
		        	existingPlant.setSoil_type(plantDTO.getSoil_type());
		        }
		        
		        if (plantDTO.getPerennial() != null) {
		        	existingPlant.setPerennial(plantDTO.getPerennial());
		        }
		        
		        if (plantDTO.getIdeal_location() !=null ) {
		        	existingPlant.setIdeal_location(plantDTO.getIdeal_location());
		        }
		        
		        if(plantDTO.getIdeal_placement() != null ) {
		        	existingPlant.setIdeal_placement(plantDTO.getIdeal_placement());
		        }
		        
		        if (plantDTO.getPropagation() != null ) {
		        	existingPlant.setPropagation(plantDTO.getPropagation());
		        }
		        
		        if (plantDTO.getUses() != null ) {
		        	existingPlant.setUses(plantDTO.getUses());
		        }
		        
		        if (plantDTO.getFertilization_schedule() !=null) {
		        	existingPlant.setFertilization_schedule(plantDTO.getFertilization_schedule());
		        }
		        
				
				  if (plantDTO.getFeatureList() != null) {
					  System.out.println("Feature List updated");
				  existingPlant.setFeatureList(plantDTO.getFeatureList()); }
				
				  if (plantDTO.getCompanionPlants() != null &&
				  !plantDTO.getCompanionPlants().isEmpty()) {
					  System.out.println("Compagnion List updated");
					  List<Plant> plants =
				  plantRepository.findAllById(plantDTO.getCompanionPlants());
					  
					  System.out.println("plants"+ plants);
				  existingPlant.setCompanionPlants(plants);
				  
				  }
				  
				  
				  if (plantDTO.getCommonPests() != null) {
					    // Get all pests from the DTO IDs
					    List<Common_pest> newPests = pestRepository.findAllById(plantDTO.getCommonPests());
					    
					    // Get current pests to identify removals
					    List<Common_pest> currentPests = existingPlant.getCommonPests();
					    if (currentPests == null) {
					        currentPests = new ArrayList<>();
					    }

					    // Remove this plant from pests that are no longer associated
					    for (Common_pest currentPest : new ArrayList<>(currentPests)) {
					        if (!newPests.contains(currentPest)) {
					            currentPest.getPlantList().remove(existingPlant);
					            pestRepository.save(currentPest);
					            currentPests.remove(currentPest);
					        }
					    }

					    // Add to new pests (with duplicate check)
					    for (Common_pest newPest : newPests) {
					        if (!currentPests.contains(newPest)) {
					            currentPests.add(newPest);
					            
					            // Update the pest's plant list
					            List<Plant> pestPlants = newPest.getPlantList();
					            if (pestPlants == null) {
					                pestPlants = new ArrayList<>();
					                newPest.setPlantList(pestPlants);
					            }
					            
					            if (!pestPlants.contains(existingPlant)) {
					                pestPlants.add(existingPlant);
					            }
					        }
					    }

					    existingPlant.setCommonPests(currentPests);
					    pestRepository.saveAll(newPests);
					}
				  if (plantDTO.getPlantTasks() != null) {
					    System.out.println("PlantTasks updating ...");
					    
					    // Clear existing tasks
					    existingPlant.getPlantTasks().clear();
					    
					    for (PlantTaskDTO plantTaskDTO : plantDTO.getPlantTasks()) {
					        System.out.println("Processing plantTask: " + plantTaskDTO);
					        
					        if (plantTaskDTO.getTaskId() == null) {
					            throw new IllegalArgumentException("Task ID cannot be null");
					        }
					        
					        Task task = taskService.findTaskById(plantTaskDTO.getTaskId())
					            .orElseThrow(() -> new IllegalArgumentException("Task not found for ID: " + plantTaskDTO.getTaskId()));
					        
					        PlantTask plantTask = new PlantTask();
					        plantTask.setPlant(existingPlant);
					        plantTask.setTask(task);
					        plantTask.setTodo(StringUtils.defaultIfBlank(plantTaskDTO.getTodo(), ""));
					        
					        System.out.println("Created plantTask: " + plantTask);
					        
					        existingPlant.getPlantTasks().add(plantTask);
					    }
					}
					
		        // 5. Save updated plant
		        Plant updatedPlant = plantService.save(existingPlant);

		        return ResponseEntity.ok(Map.of(
		                "success", true,
		                "plant", updatedPlant
		        ));
		    } catch (IOException e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                .body(Map.of(
		                        "success", false,
		                        "error", "File processing error: " + e.getMessage()
		                ));
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                .body(Map.of(
		                        "success", false,
		                        "error", "Server error: " + e.getMessage()
		                ));
		    }
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
