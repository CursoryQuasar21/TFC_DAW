package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Avion;
import com.mycompany.myapp.repository.AvionRepository;
import com.mycompany.myapp.service.AvionService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Avion}.
 */
@RestController
@RequestMapping("/api")
public class AvionResource {

    private final Logger log = LoggerFactory.getLogger(AvionResource.class);

    private static final String ENTITY_NAME = "avion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AvionService avionService;

    private final AvionRepository avionRepository;

    public AvionResource(AvionService avionService, AvionRepository avionRepository) {
        this.avionService = avionService;
        this.avionRepository = avionRepository;
    }

    /**
     * {@code POST  /avions} : Create a new avion.
     *
     * @param avion the avion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new avion, or with status {@code 400 (Bad Request)} if the avion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/avions")
    public ResponseEntity<Avion> createAvion(@Valid @RequestBody Avion avion) throws URISyntaxException {
        log.debug("REST request to save Avion : {}", avion);
        if (avion.getId() != null) {
            throw new BadRequestAlertException("A new avion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Avion result = avionService.save(avion);
        return ResponseEntity
            .created(new URI("/api/avions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /avions/:id} : Updates an existing avion.
     *
     * @param id the id of the avion to save.
     * @param avion the avion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated avion,
     * or with status {@code 400 (Bad Request)} if the avion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the avion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/avions/{id}")
    public ResponseEntity<Avion> updateAvion(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Avion avion)
        throws URISyntaxException {
        log.debug("REST request to update Avion : {}, {}", id, avion);
        if (avion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, avion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!avionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Avion result = avionService.save(avion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, avion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /avions/:id} : Partial updates given fields of an existing avion, field will ignore if it is null
     *
     * @param id the id of the avion to save.
     * @param avion the avion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated avion,
     * or with status {@code 400 (Bad Request)} if the avion is not valid,
     * or with status {@code 404 (Not Found)} if the avion is not found,
     * or with status {@code 500 (Internal Server Error)} if the avion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/avions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Avion> partialUpdateAvion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Avion avion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Avion partially : {}, {}", id, avion);
        if (avion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, avion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!avionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Avion> result = avionService.partialUpdate(avion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, avion.getId().toString())
        );
    }

    /**
     * {@code GET  /avions} : get all the avions.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of avions in body.
     */
    @GetMapping("/avions")
    public ResponseEntity<List<Avion>> getAllAvions(Pageable pageable, @RequestParam(required = false) String filter) {
        if ("vuelo-is-null".equals(filter)) {
            log.debug("REST request to get all Avions where vuelo is null");
            return new ResponseEntity<>(avionService.findAllWhereVueloIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of Avions");
        Page<Avion> page = avionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /avions/:id} : get the "id" avion.
     *
     * @param id the id of the avion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the avion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/avions/{id}")
    public ResponseEntity<Avion> getAvion(@PathVariable Long id) {
        log.debug("REST request to get Avion : {}", id);
        Optional<Avion> avion = avionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(avion);
    }

    /**
     * {@code DELETE  /avions/:id} : delete the "id" avion.
     *
     * @param id the id of the avion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/avions/{id}")
    public ResponseEntity<Void> deleteAvion(@PathVariable Long id) {
        log.debug("REST request to delete Avion : {}", id);
        avionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
