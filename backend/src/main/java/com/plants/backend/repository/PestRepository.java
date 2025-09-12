package com.plants.backend.repository;

import com.plants.backend.data.entities.Common_pest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PestRepository extends JpaRepository<Common_pest, Long> {


}
