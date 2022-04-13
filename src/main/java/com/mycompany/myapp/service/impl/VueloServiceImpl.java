package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Vuelo;
import com.mycompany.myapp.repository.VueloRepository;
import com.mycompany.myapp.service.VueloService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vuelo}.
 */
@Service
@Transactional
public class VueloServiceImpl implements VueloService {

    private final Logger log = LoggerFactory.getLogger(VueloServiceImpl.class);

    private final VueloRepository vueloRepository;

    public VueloServiceImpl(VueloRepository vueloRepository) {
        this.vueloRepository = vueloRepository;
    }

    @Override
    public Vuelo save(Vuelo vuelo) {
        log.debug("Request to save Vuelo : {}", vuelo);
        return vueloRepository.save(vuelo);
    }

    @Override
    public Optional<Vuelo> partialUpdate(Vuelo vuelo) {
        log.debug("Request to partially update Vuelo : {}", vuelo);

        return vueloRepository
            .findById(vuelo.getId())
            .map(
                existingVuelo -> {
                    if (vuelo.getFechaOrigen() != null) {
                        existingVuelo.setFechaOrigen(vuelo.getFechaOrigen());
                    }
                    if (vuelo.getFechaDestino() != null) {
                        existingVuelo.setFechaDestino(vuelo.getFechaDestino());
                    }
                    if (vuelo.getPrecio() != null) {
                        existingVuelo.setPrecio(vuelo.getPrecio());
                    }

                    return existingVuelo;
                }
            )
            .map(vueloRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vuelo> findAll(Pageable pageable) {
        log.debug("Request to get all Vuelos");
        return vueloRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vuelo> findOne(Long id) {
        log.debug("Request to get Vuelo : {}", id);
        return vueloRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vuelo : {}", id);
        vueloRepository.deleteById(id);
    }
}
