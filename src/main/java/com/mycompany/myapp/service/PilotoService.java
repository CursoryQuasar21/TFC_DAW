package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Piloto;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Piloto}.
 */
public interface PilotoService {
    /**
     * Save a piloto.
     *
     * @param piloto the entity to save.
     * @return the persisted entity.
     */
    Piloto save(Piloto piloto);

    /**
     * Partially updates a piloto.
     *
     * @param piloto the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Piloto> partialUpdate(Piloto piloto);

    /**
     * Get all the pilotos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Piloto> findAll(Pageable pageable);

    /**
     * Get the "id" piloto.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Piloto> findOne(Long id);

    /**
     * Delete the "id" piloto.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
