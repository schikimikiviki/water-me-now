package com.plants.backend.data.dtos;

public class PlantTaskDTO {
    private Long plantId;
    private String todo;
    private Long taskId;

    public PlantTaskDTO() {
    }


    public PlantTaskDTO(Long plantId, Long taskId, String todo) {
        this.plantId = plantId;
        this.taskId = taskId;
        this.todo = todo;
    }

    @Override
    public String toString() {
        return "PlantTaskDTO{" +
                "taskId=" + taskId +
                ", todo='" + todo + '\'' +
                '}';
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getPlantId() {
        return plantId;
    }

    public void setPlantId(Long plantId) {
        this.plantId = plantId;
    }

    public String getTodo() {
        return todo;
    }

    public void setTodo(String todo) {
        this.todo = todo;
    }

}