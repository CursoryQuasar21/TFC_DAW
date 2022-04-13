package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Avion;
import com.mycompany.myapp.repository.AvionRepository;
import com.mycompany.myapp.service.AvionService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Avion}.
 */
@Service
@Transactional
public class AvionServiceImpl implements AvionService {

    private final Logger log = LoggerFactory.getLogger(AvionServiceImpl.class);

    private final AvionRepository avionRepository;

    public AvionServiceImpl(AvionRepository avionRepository) {
        this.avionRepository = avionRepository;
    }

    @Override
    public Avion save(Avion avion) {
        log.debug("Request to save Avion : {}", avion);
        return avionRepository.save(avion);
    }

    @Override
    public Optional<Avion> partialUpdate(Avion avion) {
        log.debug("Request to partially update Avion : {}", avion);

        return avionRepository
            .findById(avion.getId())
            .map(
                existingAvion -> {
                    if (avion.getCosteFabricacion() != null) {
                        existingAvion.setCosteFabricacion(avion.getCosteFabricacion());
                    }
                    if (avion.getAnioFabricacion() != null) {
                        existingAvion.setAnioFabricacion(avion.getAnioFabricacion());
                    }

                    return existingAvion;
                }
            )
            .map(avionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Avion> findAll(Pageable pageable) {
        log.debug("Request to get all Avions");
        return avionRepository.findAll(pageable);
    }

    /**
     *  Get all the avions where Vuelo is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Avion> findAllWhereVueloIsNull() {
        log.debug("Request to get all avions where Vuelo is null");
        return StreamSupport
            .stream(avionRepository.findAll().spliterator(), false)
            .filter(avion -> avion.getVuelo() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Avion> findOne(Long id) {
        log.debug("Request to get Avion : {}", id);
        return avionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Avion : {}", id);
        avionRepository.deleteById(id);
    }
}
