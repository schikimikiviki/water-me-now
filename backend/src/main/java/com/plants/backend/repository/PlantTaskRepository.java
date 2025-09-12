package com.plants.backend.repository;

import com.plants.backend.data.entities.PlantTask;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PlantTaskRepository extends JpaRepository<PlantTask, Long> {


}
