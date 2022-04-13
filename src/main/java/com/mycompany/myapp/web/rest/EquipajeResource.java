package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Equipaje;
import com.mycompany.myapp.repository.EquipajeRepository;
import com.mycompany.myapp.service.EquipajeService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Equipaje}.
 */
@RestController
@RequestMapping("/api")
public class EquipajeResource {

    private final Logger log = LoggerFactory.getLogger(EquipajeResource.class);

    private static final String ENTITY_NAME = "equipaje";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EquipajeService equipajeService;

    private final EquipajeRepository equipajeRepository;

    public EquipajeResource(EquipajeService equipajeService, EquipajeRepository equipajeRepository) {
        this.equipajeService = equipajeService;
        this.equipajeRepository = equipajeRepository;
    }

    /**
     * {@code POST  /equipajes} : Create a new equipaje.
     *
     * @param equipaje the equipaje to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new equipaje, or with status {@code 400 (Bad Request)} if the equipaje has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/equipajes")
    public ResponseEntity<Equipaje> createEquipaje(@Valid @RequestBody Equipaje equipaje) throws URISyntaxException {
        log.debug("REST request to save Equipaje : {}", equipaje);
        if (equipaje.getId() != null) {
            throw new BadRequestAlertException("A new equipaje cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Equipaje result = equipajeService.save(equipaje);
        return ResponseEntity
            .created(new URI("/api/equipajes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /equipajes/:id} : Updates an existing equipaje.
     *
     * @param id the id of the equipaje to save.
     * @param equipaje the equipaje to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated equipaje,
     * or with status {@code 400 (Bad Request)} if the equipaje is not valid,
     * or with status {@code 500 (Internal Server Error)} if the equipaje couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/equipajes/{id}")
    public ResponseEntity<Equipaje> updateEquipaje(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Equipaje equipaje
    ) throws URISyntaxException {
        log.debug("REST request to update Equipaje : {}, {}", id, equipaje);
        if (equipaje.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, equipaje.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!equipajeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Equipaje result = equipajeService.save(equipaje);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, equipaje.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /equipajes/:id} : Partial updates given fields of an existing equipaje, field will ignore if it is null
     *
     * @param id the id of the equipaje to save.
     * @param equipaje the equipaje to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated equipaje,
     * or with status {@code 400 (Bad Request)} if the equipaje is not valid,
     * or with status {@code 404 (Not Found)} if the equipaje is not found,
     * or with status {@code 500 (Internal Server Error)} if the equipaje couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/equipajes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Equipaje> partialUpdateEquipaje(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Equipaje equipaje
    ) throws URISyntaxException {
        log.debug("REST request to partial update Equipaje partially : {}, {}", id, equipaje);
        if (equipaje.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, equipaje.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!equipajeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Equipaje> result = equipajeService.partialUpdate(equipaje);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, equipaje.getId().toString())
        );
    }

    /**
     * {@code GET  /equipajes} : get all the equipajes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of equipajes in body.
     */
    @GetMapping("/equipajes")
    public ResponseEntity<List<Equipaje>> getAllEquipajes(Pageable pageable) {
        log.debug("REST request to get a page of Equipajes");
        Page<Equipaje> page = equipajeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /equipajes/:id} : get the "id" equipaje.
     *
     * @param id the id of the equipaje to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the equipaje, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/equipajes/{id}")
    public ResponseEntity<Equipaje> getEquipaje(@PathVariable Long id) {
        log.debug("REST request to get Equipaje : {}", id);
        Optional<Equipaje> equipaje = equipajeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(equipaje);
    }

    /**
     * {@code DELETE  /equipajes/:id} : delete the "id" equipaje.
     *
     * @param id the id of the equipaje to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/equipajes/{id}")
    public ResponseEntity<Void> deleteEquipaje(@PathVariable Long id) {
        log.debug("REST request to delete Equipaje : {}", id);
        equipajeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
