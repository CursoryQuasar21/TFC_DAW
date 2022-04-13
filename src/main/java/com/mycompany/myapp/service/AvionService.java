package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Avion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Avion}.
 */
public interface AvionService {
    /**
     * Save a avion.
     *
     * @param avion the entity to save.
     * @return the persisted entity.
     */
    Avion save(Avion avion);

    /**
     * Partially updates a avion.
     *
     * @param avion the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Avion> partialUpdate(Avion avion);

    /**
     * Get all the avions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Avion> findAll(Pageable pageable);
    /**
     * Get all the Avion where Vuelo is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Avion> findAllWhereVueloIsNull();

    /**
     * Get the "id" avion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Avion> findOne(Long id);

    /**
     * Delete the "id" avion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
