package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Aeropuerto;
import com.mycompany.myapp.domain.Ciudad;
import com.mycompany.myapp.repository.AeropuertoRepository;
import com.mycompany.myapp.repository.AvionRepository;
import com.mycompany.myapp.repository.CiudadRepository;
import com.mycompany.myapp.service.CiudadService;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Ciudad}.
 */
@Service
@Transactional
public class CiudadServiceImpl implements CiudadService {

    private final Logger log = LoggerFactory.getLogger(CiudadServiceImpl.class);

    private final CiudadRepository ciudadRepository;
    private final AeropuertoRepository aeropuertoRepository;

    public CiudadServiceImpl(CiudadRepository ciudadRepository, AeropuertoRepository aeropuertoRepository) {
        this.ciudadRepository = ciudadRepository;
        this.aeropuertoRepository = aeropuertoRepository;
    }

    @Override
    public Ciudad save(Ciudad ciudad) {
        log.debug("Request to save Ciudad : {}", ciudad);
        log.debug("Lista Aeropuertos save: {}", ciudad.getAeropuertos());
        Ciudad ciudad2 = ciudad;
        if (ciudad.getId() != null) {
            aeropuertoRepository.updateAeropuertosDeleteCiudadByCiudadId(ciudad.getId());
            if (ciudad.getAeropuertos() != null) {
                ciudad
                    .getAeropuertos()
                    .forEach(i -> aeropuertoRepository.updateAeropuertoSaveCiudadByCiudadIdAndAeropuertoId(ciudad.getId(), i.getId()));
            }
            ciudadRepository.save(ciudad);
        } else {
            ciudad2 = ciudadRepository.save(ciudad);
            if (ciudad2.getAeropuertos() != null) ciudad.getAeropuertos().forEach(i -> aeropuertoRepository.save(i));
        }
        return ciudad;
    }

    @Override
    public Optional<Ciudad> partialUpdate(Ciudad ciudad) {
        log.debug("Request to partially update Ciudad : {}", ciudad);

        return ciudadRepository
            .findById(ciudad.getId())
            .map(
                existingCiudad -> {
                    if (ciudad.getNombre() != null) {
                        existingCiudad.setNombre(ciudad.getNombre());
                    }

                    return existingCiudad;
                }
            )
            .map(ciudadRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Ciudad> findAll(Pageable pageable) {
        log.debug("Request to get all Ciudads");
        return ciudadRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Ciudad> findOne(Long id) {
        log.debug("Request to get Ciudad : {}", id);
        return ciudadRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Ciudad : {}", id);
        ciudadRepository.deleteById(id);
    }
}
