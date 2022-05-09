package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Pais;
import com.mycompany.myapp.repository.CiudadRepository;
import com.mycompany.myapp.repository.PaisRepository;
import com.mycompany.myapp.service.CiudadService;
import com.mycompany.myapp.service.PaisService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pais}.
 */
@Service
@Transactional
public class PaisServiceImpl implements PaisService {

    private final Logger log = LoggerFactory.getLogger(PaisServiceImpl.class);

    private final PaisRepository paisRepository;

    private final CiudadRepository ciudadRepository;

    public PaisServiceImpl(PaisRepository paisRepository, CiudadRepository ciudadRepository) {
        this.paisRepository = paisRepository;
        this.ciudadRepository = ciudadRepository;
    }

    @Override
    public Pais save(Pais pais) {
        log.debug("Request to save Pais : {}", pais);
        log.debug("Lista Ciudades save: {}", pais.getCiudads());
        Pais pais2 = pais;
        if (pais.getId() != null) {
            ciudadRepository.updateCiudadesDeletePaisByPaisId(pais.getId());
            if (pais.getCiudads() != null) {
                pais.getCiudads().forEach(i -> ciudadRepository.updateCiudadSavePaisByPaisIdAndCiudadId(pais.getId(), i.getId()));
            }
            paisRepository.save(pais);
        } else {
            pais2 = paisRepository.save(pais);
            if (pais2.getCiudads() != null) pais.getCiudads().forEach(i -> ciudadRepository.save(i));
        }
        return pais;
    }

    @Override
    public Optional<Pais> partialUpdate(Pais pais) {
        log.debug("Request to partially update Pais : {}", pais);

        return paisRepository
            .findById(pais.getId())
            .map(
                existingPais -> {
                    if (pais.getNombre() != null) {
                        existingPais.setNombre(pais.getNombre());
                    }

                    return existingPais;
                }
            )
            .map(paisRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Pais> findAll(Pageable pageable) {
        log.debug("Request to get all Pais");
        return paisRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pais> findOne(Long id) {
        log.debug("Request to get Pais : {}", id);
        return paisRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Pais : {}", id);
        paisRepository.deleteById(id);
    }
}
