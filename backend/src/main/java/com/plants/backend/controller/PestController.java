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
import com.plants.backend.data.Plant;
import com.plants.backend.service.PestService;

@RestController
@RequestMapping("/pests")
public class PestController {



	private final PestService pestService;


	public PestController(PestService pestService) {
		this.pestService = pestService;
	}


	@GetMapping("/all")
	public List<Common_pest> getAllPests() {
		// Return list of users from the database
		return pestService.findAll();
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
