package com.plants.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.plants.backend.data.dtos.CommonPestDTO;
import com.plants.backend.data.entities.Common_pest;
import com.plants.backend.data.entities.Plant;
import com.plants.backend.repository.PlantRepository;
import com.plants.backend.service.PestService;
import com.plants.backend.service.PlantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/pests")
public class PestController {

    private final PestService pestService;

    private final PlantService plantService;

    private final PlantRepository plantRepository;

    public PestController(PestService pestService, PlantService plantService, PlantRepository plantRepository) {
        this.pestService = pestService;
        this.plantService = plantService;
        this.plantRepository = plantRepository;
    }

    @GetMapping("/all")
    public List<CommonPestDTO> getAllPests() {

        return pestService.findAll();
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPest(@RequestPart("imageFile") MultipartFile imageFile,
                                     @RequestPart("pestData") CommonPestDTO pestDTO) {

        System.out.println("Received pestDTO: " + pestDTO);
        System.out.println("PlantList: " + (pestDTO.getPlantList()));

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

            // 2. Convert DTO to Entity
            List<Plant> plants = plantRepository.findAllById(pestDTO.getPlantList());

            System.out.println("Plants found: " + (plants));

            Common_pest pest = new Common_pest();
            pest.setName(pestDTO.getName());
            pest.setTodo(pestDTO.getTodo());
            pest.setImageFile(imageName); // Save the renamed image
            pest.setPlantList(plants);

            // 3. Save Pest
            pestService.save(pest);

            return ResponseEntity.ok(Map.of("success", true, "pest", pest));
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

    @PatchMapping(value = "/{pestId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePest(
            @PathVariable Long pestId,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart("pestBody") String pestBodyJson) {

        System.out.println("Received PATCH request for pestId: " + pestId);
        System.out.println("Received raw pestBody: " + pestBodyJson);


        try {

            ObjectMapper objectMapper = new ObjectMapper();
            CommonPestDTO pestDTO = objectMapper.readValue(pestBodyJson, CommonPestDTO.class);

            System.out.println("Parsed pestDTO: " + pestDTO);
            System.out.println("PlantList: " + pestDTO.getPlantList());

            // 1. Find existing pest
            Optional<Common_pest> existingPlantOpt = pestService.findPestById(pestId);
            if (!existingPlantOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Common_pest existingPest = existingPlantOpt.get();

            // 2. Handle Image Upload (only if new image provided)
            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if it exists
                if (existingPest.getImageFile() != null) {
                    Path oldImagePath = Paths.get("uploads/" + existingPest.getImageFile());
                    Files.deleteIfExists(oldImagePath);
                }

                // Save new image
                String uploadDir = "uploads/";
                String imageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
                Path imagePath = Paths.get(uploadDir + imageName);
                Files.createDirectories(imagePath.getParent());
                Files.write(imagePath, imageFile.getBytes());
                existingPest.setImageFile(imageName);
            }

            // 3. Update pest properties
            if (pestDTO.getName() != null) {
                existingPest.setName(pestDTO.getName());
            }
            if (pestDTO.getTodo() != null) {
                existingPest.setTodo(pestDTO.getTodo());
            }

            // 4. Update plant associations if provided
            if (pestDTO.getPlantList() != null && !pestDTO.getPlantList().isEmpty()) {
                List<Plant> plants = plantRepository.findAllById(pestDTO.getPlantList());
                existingPest.setPlantList(plants);
            }

            // 5. Save updated pest
            Common_pest updatedPest = pestService.save(existingPest);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "pest", updatedPest
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


    @DeleteMapping("/{pestId}")
    public ResponseEntity<?> deletePest(@PathVariable Long pestId) {
        try {
            pestService.deletePestById(pestId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Pest deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Pest not found"));
        }
    }

}
