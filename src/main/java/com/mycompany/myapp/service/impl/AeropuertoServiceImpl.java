package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Aeropuerto;
import com.mycompany.myapp.repository.AeropuertoRepository;
import com.mycompany.myapp.service.AeropuertoService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Aeropuerto}.
 */
@Service
@Transactional
public class AeropuertoServiceImpl implements AeropuertoService {

    private final Logger log = LoggerFactory.getLogger(AeropuertoServiceImpl.class);

    private final AeropuertoRepository aeropuertoRepository;

    public AeropuertoServiceImpl(AeropuertoRepository aeropuertoRepository) {
        this.aeropuertoRepository = aeropuertoRepository;
    }

    @Override
    public Aeropuerto save(Aeropuerto aeropuerto) {
        log.debug("Request to save Aeropuerto : {}", aeropuerto);
        return aeropuertoRepository.save(aeropuerto);
    }

    @Override
    public Optional<Aeropuerto> partialUpdate(Aeropuerto aeropuerto) {
        log.debug("Request to partially update Aeropuerto : {}", aeropuerto);

        return aeropuertoRepository
            .findById(aeropuerto.getId())
            .map(
                existingAeropuerto -> {
                    if (aeropuerto.getNombre() != null) {
                        existingAeropuerto.setNombre(aeropuerto.getNombre());
                    }

                    return existingAeropuerto;
                }
            )
            .map(aeropuertoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Aeropuerto> findAll(Pageable pageable) {
        log.debug("Request to get all Aeropuertos");
        return aeropuertoRepository.findAll(pageable);
    }

    public Page<Aeropuerto> findAllWithEagerRelationships(Pageable pageable) {
        return aeropuertoRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Aeropuerto> findOne(Long id) {
        log.debug("Request to get Aeropuerto : {}", id);
        return aeropuertoRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Aeropuerto : {}", id);
        aeropuertoRepository.deleteById(id);
    }
}
