package com.plants.backend.repository;

import com.plants.backend.data.entities.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepository extends JpaRepository<Plant, Long> {


}
