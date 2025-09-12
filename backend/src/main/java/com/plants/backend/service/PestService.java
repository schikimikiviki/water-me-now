package com.plants.backend.service;

import com.plants.backend.data.dtos.CommonPestDTO;
import com.plants.backend.data.dtos.DTOMapper;
import com.plants.backend.data.entities.Common_pest;
import com.plants.backend.repository.PestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PestService {

    private final PestRepository pestRepository;


    public PestService(PestRepository pestRepository) {
        this.pestRepository = pestRepository;
    }

    public List<CommonPestDTO> findAll() {
        return pestRepository.findAll().stream()
                .map(DTOMapper::toCommonPestDTO)
                .collect(Collectors.toList());
    }


    public Common_pest save(Common_pest commonPest) {
        return pestRepository.save(commonPest);
    }

    public Optional<Common_pest> findPestById(Long id) {
        return pestRepository.findById(id);
    }

    public void deletePestById(Long id) {
        pestRepository.deleteById(id);
    }


}
