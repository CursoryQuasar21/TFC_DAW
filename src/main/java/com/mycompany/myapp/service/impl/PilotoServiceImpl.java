package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Piloto;
import com.mycompany.myapp.repository.PilotoRepository;
import com.mycompany.myapp.service.PilotoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Piloto}.
 */
@Service
@Transactional
public class PilotoServiceImpl implements PilotoService {

    private final Logger log = LoggerFactory.getLogger(PilotoServiceImpl.class);

    private final PilotoRepository pilotoRepository;

    public PilotoServiceImpl(PilotoRepository pilotoRepository) {
        this.pilotoRepository = pilotoRepository;
    }

    @Override
    public Piloto save(Piloto piloto) {
        log.debug("Request to save Piloto : {}", piloto);
        return pilotoRepository.save(piloto);
    }

    @Override
    public Optional<Piloto> partialUpdate(Piloto piloto) {
        log.debug("Request to partially update Piloto : {}", piloto);

        return pilotoRepository
            .findById(piloto.getId())
            .map(
                existingPiloto -> {
                    if (piloto.getNombre() != null) {
                        existingPiloto.setNombre(piloto.getNombre());
                    }
                    if (piloto.getApellidos() != null) {
                        existingPiloto.setApellidos(piloto.getApellidos());
                    }
                    if (piloto.getPasaporte() != null) {
                        existingPiloto.setPasaporte(piloto.getPasaporte());
                    }

                    return existingPiloto;
                }
            )
            .map(pilotoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Piloto> findAll(Pageable pageable) {
        log.debug("Request to get all Pilotos");
        return pilotoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Piloto> findOne(Long id) {
        log.debug("Request to get Piloto : {}", id);
        return pilotoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Piloto : {}", id);
        pilotoRepository.deleteById(id);
    }
}
