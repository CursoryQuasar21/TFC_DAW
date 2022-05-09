package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Pasajero;
import com.mycompany.myapp.repository.EquipajeRepository;
import com.mycompany.myapp.repository.PasajeroRepository;
import com.mycompany.myapp.service.PasajeroService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pasajero}.
 */
@Service
@Transactional
public class PasajeroServiceImpl implements PasajeroService {

    private final Logger log = LoggerFactory.getLogger(PasajeroServiceImpl.class);

    private final PasajeroRepository pasajeroRepository;

    private final EquipajeRepository equipajeRepository;

    public PasajeroServiceImpl(PasajeroRepository pasajeroRepository, EquipajeRepository equipajeRepository) {
        this.pasajeroRepository = pasajeroRepository;
        this.equipajeRepository = equipajeRepository;
    }

    @Override
    public Pasajero save(Pasajero pasajero) {
        log.debug("Request to save Pasajero : {}", pasajero);
        Pasajero pasajero2 = pasajero;
        if (pasajero.getId() != null) {
            equipajeRepository.updateEquipajesDeletePasajeroByPasajeroId(pasajero.getId());
            if (pasajero.getEquipajes() != null) {
                pasajero
                    .getEquipajes()
                    .forEach(i -> equipajeRepository.updateEquipajeSavePasajeroByPasajeroIdAndEquipajeId(pasajero.getId(), i.getId()));
            }
            pasajeroRepository.save(pasajero);
        } else {
            pasajero2 = pasajeroRepository.save(pasajero);
            if (pasajero2.getEquipajes() != null) pasajero.getEquipajes().forEach(i -> equipajeRepository.save(i));
        }
        return pasajero;
    }

    @Override
    public Optional<Pasajero> partialUpdate(Pasajero pasajero) {
        log.debug("Request to partially update Pasajero : {}", pasajero);

        return pasajeroRepository
            .findById(pasajero.getId())
            .map(
                existingPasajero -> {
                    if (pasajero.getNombre() != null) {
                        existingPasajero.setNombre(pasajero.getNombre());
                    }
                    if (pasajero.getApellidos() != null) {
                        existingPasajero.setApellidos(pasajero.getApellidos());
                    }
                    if (pasajero.getPasaporte() != null) {
                        existingPasajero.setPasaporte(pasajero.getPasaporte());
                    }
                    if (pasajero.getCantidadEquipaje() != null) {
                        existingPasajero.setCantidadEquipaje(pasajero.getCantidadEquipaje());
                    }
                    if (pasajero.getNumeroAsiento() != null) {
                        existingPasajero.setNumeroAsiento(pasajero.getNumeroAsiento());
                    }

                    return existingPasajero;
                }
            )
            .map(pasajeroRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Pasajero> findAll(Pageable pageable) {
        log.debug("Request to get all Pasajeros");
        return pasajeroRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pasajero> findOne(Long id) {
        log.debug("Request to get Pasajero : {}", id);
        return pasajeroRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Pasajero : {}", id);
        pasajeroRepository.deleteById(id);
    }
}
