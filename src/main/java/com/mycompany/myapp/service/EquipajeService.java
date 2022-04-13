package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Equipaje;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Equipaje}.
 */
public interface EquipajeService {
    /**
     * Save a equipaje.
     *
     * @param equipaje the entity to save.
     * @return the persisted entity.
     */
    Equipaje save(Equipaje equipaje);

    /**
     * Partially updates a equipaje.
     *
     * @param equipaje the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Equipaje> partialUpdate(Equipaje equipaje);

    /**
     * Get all the equipajes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Equipaje> findAll(Pageable pageable);

    /**
     * Get the "id" equipaje.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Equipaje> findOne(Long id);

    /**
     * Delete the "id" equipaje.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
