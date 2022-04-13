package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Ciudad;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Ciudad}.
 */
public interface CiudadService {
    /**
     * Save a ciudad.
     *
     * @param ciudad the entity to save.
     * @return the persisted entity.
     */
    Ciudad save(Ciudad ciudad);

    /**
     * Partially updates a ciudad.
     *
     * @param ciudad the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Ciudad> partialUpdate(Ciudad ciudad);

    /**
     * Get all the ciudads.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Ciudad> findAll(Pageable pageable);

    /**
     * Get the "id" ciudad.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Ciudad> findOne(Long id);

    /**
     * Delete the "id" ciudad.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
