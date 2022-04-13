package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Equipaje;
import com.mycompany.myapp.repository.EquipajeRepository;
import com.mycompany.myapp.service.EquipajeService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Equipaje}.
 */
@Service
@Transactional
public class EquipajeServiceImpl implements EquipajeService {

    private final Logger log = LoggerFactory.getLogger(EquipajeServiceImpl.class);

    private final EquipajeRepository equipajeRepository;

    public EquipajeServiceImpl(EquipajeRepository equipajeRepository) {
        this.equipajeRepository = equipajeRepository;
    }

    @Override
    public Equipaje save(Equipaje equipaje) {
        log.debug("Request to save Equipaje : {}", equipaje);
        return equipajeRepository.save(equipaje);
    }

    @Override
    public Optional<Equipaje> partialUpdate(Equipaje equipaje) {
        log.debug("Request to partially update Equipaje : {}", equipaje);

        return equipajeRepository
            .findById(equipaje.getId())
            .map(
                existingEquipaje -> {
                    if (equipaje.getTipo() != null) {
                        existingEquipaje.setTipo(equipaje.getTipo());
                    }

                    return existingEquipaje;
                }
            )
            .map(equipajeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Equipaje> findAll(Pageable pageable) {
        log.debug("Request to get all Equipajes");
        return equipajeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Equipaje> findOne(Long id) {
        log.debug("Request to get Equipaje : {}", id);
        return equipajeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Equipaje : {}", id);
        equipajeRepository.deleteById(id);
    }
}
