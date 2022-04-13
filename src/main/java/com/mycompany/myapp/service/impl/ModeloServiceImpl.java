package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Modelo;
import com.mycompany.myapp.repository.ModeloRepository;
import com.mycompany.myapp.service.ModeloService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Modelo}.
 */
@Service
@Transactional
public class ModeloServiceImpl implements ModeloService {

    private final Logger log = LoggerFactory.getLogger(ModeloServiceImpl.class);

    private final ModeloRepository modeloRepository;

    public ModeloServiceImpl(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    @Override
    public Modelo save(Modelo modelo) {
        log.debug("Request to save Modelo : {}", modelo);
        return modeloRepository.save(modelo);
    }

    @Override
    public Optional<Modelo> partialUpdate(Modelo modelo) {
        log.debug("Request to partially update Modelo : {}", modelo);

        return modeloRepository
            .findById(modelo.getId())
            .map(
                existingModelo -> {
                    if (modelo.getNombre() != null) {
                        existingModelo.setNombre(modelo.getNombre());
                    }
                    if (modelo.getMotores() != null) {
                        existingModelo.setMotores(modelo.getMotores());
                    }
                    if (modelo.getCantidadPilotos() != null) {
                        existingModelo.setCantidadPilotos(modelo.getCantidadPilotos());
                    }
                    if (modelo.getCantidadTripulantes() != null) {
                        existingModelo.setCantidadTripulantes(modelo.getCantidadTripulantes());
                    }
                    if (modelo.getCantidadPasajeros() != null) {
                        existingModelo.setCantidadPasajeros(modelo.getCantidadPasajeros());
                    }
                    if (modelo.getCantidadEquipajes() != null) {
                        existingModelo.setCantidadEquipajes(modelo.getCantidadEquipajes());
                    }

                    return existingModelo;
                }
            )
            .map(modeloRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Modelo> findAll(Pageable pageable) {
        log.debug("Request to get all Modelos");
        return modeloRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Modelo> findOne(Long id) {
        log.debug("Request to get Modelo : {}", id);
        return modeloRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Modelo : {}", id);
        modeloRepository.deleteById(id);
    }
}
