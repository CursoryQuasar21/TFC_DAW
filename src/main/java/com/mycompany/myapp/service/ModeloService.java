package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Modelo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Modelo}.
 */
public interface ModeloService {
    /**
     * Save a modelo.
     *
     * @param modelo the entity to save.
     * @return the persisted entity.
     */
    Modelo save(Modelo modelo);

    /**
     * Partially updates a modelo.
     *
     * @param modelo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Modelo> partialUpdate(Modelo modelo);

    /**
     * Get all the modelos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Modelo> findAll(Pageable pageable);

    /**
     * Get the "id" modelo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Modelo> findOne(Long id);

    /**
     * Delete the "id" modelo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
