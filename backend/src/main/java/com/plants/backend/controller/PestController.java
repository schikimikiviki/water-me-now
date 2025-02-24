package com.plants.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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
import com.plants.backend.data.Plant;
import com.plants.backend.service.PestService;
import com.plants.backend.service.PlantService;

@RestController
@RequestMapping("/pests")
public class PestController {



	private final PestService pestService;
	
	private final PlantService plantService;


	public PestController(PestService pestService, PlantService plantService) {
		this.pestService = pestService;
		this.plantService = plantService;
	}


	@GetMapping("/all")
	public List<Common_pest> getAllPests() {
		// Return list of users from the database
		return pestService.findAll();
	}
	
	 @RequestMapping(value = "/add", method = RequestMethod.POST) 
		public ResponseEntity<?> addPlant(
		    @RequestParam("name") String name,
		    @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
		    @RequestParam("todo") String todo,
		    @RequestParam(value = "plantList", required = false) List<Long> plantList
		) {
			 System.out.println("Received POST /pests/add");
			 System.out.println("Received plantList: " + plantList);
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

		        // 2. Create  Object
		        Common_pest common_pest = new Common_pest();
		        common_pest.setName(name);
		        common_pest.setImageFile(imageName);
		        common_pest.setTodo(todo);
		        
		        if (plantList !=null && !plantList.isEmpty()) {
		        	 List<Plant> plants = plantService.findPlantsByIds(plantList);
				        System.out.println("Found plants: " + plants);  
				        common_pest.setPlantList(plants);	
		        }
		       
		     
		        pestService.save(common_pest);

		        return ResponseEntity.ok(Map.of("success", true, "common_pest", common_pest));
		    } catch (IOException e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		            .body(Map.of("success", false, "error", e.getMessage()));
		    }
		}


	@GetMapping("/id/{Id}")
	public Optional<Common_pest> getPestById(@PathVariable Long Id) {
		// Return details of a single user
		return pestService.findPestById(Id);
	}
	

	@PatchMapping("/{pestId}")
	public ResponseEntity<Common_pest> editPest(@PathVariable Long pestId, @RequestBody Map<String, Object> updates) {
	    Optional<Common_pest> foundPestOptional = pestService.findPestById(pestId);

	    if (foundPestOptional.isPresent()) {
	        Common_pest foundPest = foundPestOptional.get();

	        updates.forEach((key, value) -> {
	            switch (key) {
	                case "name":
	                	foundPest.setName((String) value);
	                    break;
	                case "imageFile":
	                	foundPest.setImageFile((String) value);
	                    break;
	                case "todo":
	                    foundPest.setTodo((String) value);
	                    break;
	              
	                case "plantList":
	                	foundPest.setPlantList((List<Plant>) value);
	                	break;
	                default:
	                    throw new IllegalArgumentException("Invalid field: " + key);
	            }
	        });

	        Common_pest updatedPest = pestService.save(foundPest);
	        return ResponseEntity.ok(updatedPest);
	    }

	    return ResponseEntity.notFound().build();
	}

	


	@DeleteMapping("/{pestId}")
	public ResponseEntity<?> deletePest(@PathVariable Long userId) {
		try {
			pestService.deletePestById(userId);
			return ResponseEntity.ok(Map.of("success", true, "message", "Pest deleted successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("success", false, "message", "Pest not found"));
		}
	}

}
