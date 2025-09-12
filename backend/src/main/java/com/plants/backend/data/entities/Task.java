package com.plants.backend.data.entities;

import com.plants.backend.data.enums.Repetition;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String imageFile;
    private String todo;
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlantTask> plantTasks = new ArrayList<>();

    private Boolean isRepeated;
    private Repetition repetition;

    private LocalDate date;

    public Task() {
    }

    public Task(Long id, String name, String imageFile, String todo, List<PlantTask> plantTasks, LocalDate date, Boolean isRepeated, Repetition repetition) {
        super();
        this.id = id;
        this.name = name;
        this.imageFile = imageFile;
        this.todo = todo;
        this.plantTasks = plantTasks;
        this.date = date;
        this.repetition = repetition;
        this.isRepeated = isRepeated;
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

    public void addPlantTask(PlantTask plantTask) {
        plantTasks.add(plantTask);
        plantTask.setTask(this);
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

    public List<PlantTask> getPlantTasks() {
        return plantTasks;
    }

    public void setPlantTasks(List<PlantTask> plantTasks) {
        this.plantTasks = plantTasks;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

}