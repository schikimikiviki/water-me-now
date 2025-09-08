package com.plants.backend.data;

import java.util.ArrayList;
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
        dto.setIsAlive(plant.getIsAlive());
        dto.setExtraInfo(plant.getExtraInfo());


        // Map plantTasks to PlantTaskDTO
        if (plant.getPlantTasks() != null) {
            dto.setPlantTasks(plant.getPlantTasks().stream()
                    .map(DTOMapper::toPlantTaskDTO)
                    .collect(Collectors.toList()));
        }


        if (plant.getCompanionPlants() != null) {
            dto.setCompanionPlants(plant.getCompanionPlants().stream()
                    .map(Plant::getId)
                    .collect(Collectors.toList()));
        }


        if (plant.getCommonPests() != null) {
            dto.setCommonPests(plant.getCommonPests().stream()
                    .map(Common_pest::getId)
                    .collect(Collectors.toList()));
        }


        return dto;
    }

    public static PlantTaskDTO toPlantTaskDTO(PlantTask plantTask) {
        PlantTaskDTO dto = new PlantTaskDTO();
        dto.setPlantId(plantTask.getPlant() != null ? plantTask.getPlant().getId() : null);
        dto.setTaskId(plantTask.getTask() != null ? plantTask.getTask().getId() : null);
        dto.setTodo(plantTask.getTodo());
        return dto;
    }

    public static TaskDTO toTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setImageFile(task.getImageFile());
        dto.setTodo(task.getTodo());
        dto.setDate(task.getDate());
        if (task.getPlantTasks() != null) {
            dto.setPlantTasks(task.getPlantTasks().stream()
                    .map(pt -> {
                        PlantTaskDTO ptDto = new PlantTaskDTO();
                        ptDto.setPlantId(pt.getPlant().getId());
                        ptDto.setTodo(pt.getTodo());
                        return ptDto;
                    })
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public static CommonPestDTO toCommonPestDTO(Common_pest commonPest) {
        CommonPestDTO dto = new CommonPestDTO();
        dto.setId(commonPest.getId());
        dto.setName(commonPest.getName());
        dto.setImageFile(commonPest.getImageFile());
        dto.setTodo(commonPest.getTodo());
        if (commonPest.getPlantList() != null) {
            dto.setPlantList(commonPest.getPlantList()
                    .stream()
                    .map(Plant::getId)
                    .collect(Collectors.toList()));
        } else {
            dto.setPlantList(new ArrayList<>()); // or null if preferred
        }
        return dto;
    }
}