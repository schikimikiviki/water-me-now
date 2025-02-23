package com.plants.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.plants.backend.data.Common_pest;
import com.plants.backend.repository.PestRepository;

@Service
public class PestService {

    private final PestRepository pestRepository;


    public PestService(PestRepository pestRepository) {
        this.pestRepository = pestRepository;
    }

    public List<Common_pest> findAll() {
    	return pestRepository.findAll();
    }
   
    
    public Common_pest save(Common_pest commonPest) {
    	return pestRepository.save(commonPest);
    }
    
    public Optional<Common_pest> findPestById (Long id) {
    	return pestRepository.findById(id);
    }

    public void deletePestById(Long id) {
    	pestRepository.deleteById(id);
    }

   
    
   

	
}
