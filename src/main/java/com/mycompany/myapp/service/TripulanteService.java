package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Tripulante;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Tripulante}.
 */
public interface TripulanteService {
    /**
     * Save a tripulante.
     *
     * @param tripulante the entity to save.
     * @return the persisted entity.
     */
    Tripulante save(Tripulante tripulante);

    /**
     * Partially updates a tripulante.
     *
     * @param tripulante the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Tripulante> partialUpdate(Tripulante tripulante);

    /**
     * Get all the tripulantes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Tripulante> findAll(Pageable pageable);

    /**
     * Get the "id" tripulante.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Tripulante> findOne(Long id);

    /**
     * Delete the "id" tripulante.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
