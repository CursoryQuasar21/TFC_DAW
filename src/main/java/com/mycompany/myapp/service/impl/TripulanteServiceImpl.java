package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Tripulante;
import com.mycompany.myapp.repository.TripulanteRepository;
import com.mycompany.myapp.service.TripulanteService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tripulante}.
 */
@Service
@Transactional
public class TripulanteServiceImpl implements TripulanteService {

    private final Logger log = LoggerFactory.getLogger(TripulanteServiceImpl.class);

    private final TripulanteRepository tripulanteRepository;

    public TripulanteServiceImpl(TripulanteRepository tripulanteRepository) {
        this.tripulanteRepository = tripulanteRepository;
    }

    @Override
    public Tripulante save(Tripulante tripulante) {
        log.debug("Request to save Tripulante : {}", tripulante);
        return tripulanteRepository.save(tripulante);
    }

    @Override
    public Optional<Tripulante> partialUpdate(Tripulante tripulante) {
        log.debug("Request to partially update Tripulante : {}", tripulante);

        return tripulanteRepository
            .findById(tripulante.getId())
            .map(
                existingTripulante -> {
                    if (tripulante.getNombre() != null) {
                        existingTripulante.setNombre(tripulante.getNombre());
                    }
                    if (tripulante.getApellidos() != null) {
                        existingTripulante.setApellidos(tripulante.getApellidos());
                    }
                    if (tripulante.getPasaporte() != null) {
                        existingTripulante.setPasaporte(tripulante.getPasaporte());
                    }

                    return existingTripulante;
                }
            )
            .map(tripulanteRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Tripulante> findAll(Pageable pageable) {
        log.debug("Request to get all Tripulantes");
        return tripulanteRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tripulante> findOne(Long id) {
        log.debug("Request to get Tripulante : {}", id);
        return tripulanteRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tripulante : {}", id);
        tripulanteRepository.deleteById(id);
    }
}
