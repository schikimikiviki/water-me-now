package com.plants.backend.data;

import java.util.stream.Collectors;

public class DTOMapper {

    public static PlantDTO toPlantDTO(Plant plant) {
        PlantDTO dto = new PlantDTO();
        dto.setId(plant.getId());
        dto.setName(plant.getName());
        dto.setOrigin(plant.getOrigin());
        dto.setImageFile(plant.getImageFile());
        dto.setHardiness(plant.getHardiness());
        dto.setHardiness_info(plant.getHardiness_info());
        dto.setIdeal_location(plant.getIdeal_location());
        dto.setWatering(plant.getWatering());
        dto.setSoil_type(plant.getSoil_type());
        dto.setPerennial(plant.getPerennial());
        dto.setFeatureList(plant.getFeatureList());
        dto.setIdeal_placement(plant.getIdeal_placement());
        dto.setPropagation(plant.getPropagation());
        dto.setFertilization_schedule(plant.getFertilization_schedule());
        dto.setUses(plant.getUses());

        // Map plantTasks to PlantTaskDTO
        if (plant.getPlantTaskList() != null) {
            dto.setPlantTasks(plant.getPlantTaskList().stream()
                .map(DTOMapper::toPlantTaskDTO)
                .collect(Collectors.toList()));
        }
        
        if (plant.getCommonPests() != null) {
            dto.setCommonPests(plant.getCommonPests().stream()
                .map(DTOMapper::toCommonPestDTO)
                .collect(Collectors.toList()));
        }


        return dto;
    }

    public static PlantTaskDTO toPlantTaskDTO(PlantTask plantTask) {
        PlantTaskDTO dto = new PlantTaskDTO();
        dto.setId(plantTask.getId());
        dto.setTask(toTaskDTO(plantTask.getTask())); // Map Task to TaskDTO
        return dto;
    }

    public static TaskDTO toTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setImageFile(task.getImageFile());
        dto.setTodo(task.getTodo());
        dto.setDate(task.getDate());
        return dto;
    }
    
    public static CommonPestDTO toCommonPestDTO(Common_pest commonPest) {
        CommonPestDTO dto = new CommonPestDTO();
        dto.setId(commonPest.getId());
        dto.setName(commonPest.getName());
        dto.setImageFile(commonPest.getImageFile());
        dto.setTodo(commonPest.getTodo());
        return dto;
    }
}