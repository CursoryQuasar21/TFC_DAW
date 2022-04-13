package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Aeropuerto;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Aeropuerto}.
 */
public interface AeropuertoService {
    /**
     * Save a aeropuerto.
     *
     * @param aeropuerto the entity to save.
     * @return the persisted entity.
     */
    Aeropuerto save(Aeropuerto aeropuerto);

    /**
     * Partially updates a aeropuerto.
     *
     * @param aeropuerto the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Aeropuerto> partialUpdate(Aeropuerto aeropuerto);

    /**
     * Get all the aeropuertos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Aeropuerto> findAll(Pageable pageable);

    /**
     * Get all the aeropuertos with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Aeropuerto> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" aeropuerto.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Aeropuerto> findOne(Long id);

    /**
     * Delete the "id" aeropuerto.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
