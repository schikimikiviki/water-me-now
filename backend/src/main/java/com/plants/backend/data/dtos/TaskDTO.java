package com.plants.backend.data.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.plants.backend.data.entities.Task;
import com.plants.backend.data.enums.Repetition;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


public class TaskDTO {
    private Long id;
    private String name;
    private String imageFile;
    private String todo;
    private Boolean isRepeated;
    private Repetition repetition;


    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonProperty("plantTasks")
    private List<PlantTaskDTO> plantTasks;

    public TaskDTO() {
    }

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.name = task.getName();
        this.imageFile = task.getImageFile();
        this.todo = task.getTodo();
        this.date = task.getDate();
        this.isRepeated = task.getIsRepeated();
        this.repetition = task.getRepetition();
        this.plantTasks = task.getPlantTasks().stream()
                .map(pt -> {
                    PlantTaskDTO dto = new PlantTaskDTO();
                    dto.setPlantId(pt.getPlant().getId());
                    dto.setTodo(pt.getTodo());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Boolean getIsRepeated() {
        return isRepeated;
    }

    public void setIsRepeated(Boolean isRepeated) {
        this.isRepeated = isRepeated;
    }

    public Repetition getRepetition() {
        return repetition;
    }

    public void setRepetition(Repetition repetition) {
        this.repetition = repetition;
    }

    public List<PlantTaskDTO> getPlantTasks() {
        return plantTasks;
    }

    public void setPlantTasks(List<PlantTaskDTO> list) {
        this.plantTasks = list;
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

    public String getImageFile() {
        return imageFile;
    }

    public void setImageFile(String imageFile) {
        this.imageFile = imageFile;
    }

    public String getTodo() {
        return todo;
    }

    public void setTodo(String todo) {
        this.todo = todo;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}