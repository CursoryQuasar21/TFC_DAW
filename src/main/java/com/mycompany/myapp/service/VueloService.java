package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Vuelo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Vuelo}.
 */
public interface VueloService {
    /**
     * Save a vuelo.
     *
     * @param vuelo the entity to save.
     * @return the persisted entity.
     */
    Vuelo save(Vuelo vuelo);

    /**
     * Partially updates a vuelo.
     *
     * @param vuelo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Vuelo> partialUpdate(Vuelo vuelo);

    /**
     * Get all the vuelos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Vuelo> findAll(Pageable pageable);

    /**
     * Get the "id" vuelo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Vuelo> findOne(Long id);

    /**
     * Delete the "id" vuelo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
