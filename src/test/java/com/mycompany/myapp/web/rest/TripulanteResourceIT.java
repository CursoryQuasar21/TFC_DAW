package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Tripulante;
import com.mycompany.myapp.repository.TripulanteRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TripulanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TripulanteResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDOS = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDOS = "BBBBBBBBBB";

    private static final String DEFAULT_PASAPORTE = "AAAAAAAAA";
    private static final String UPDATED_PASAPORTE = "BBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tripulantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TripulanteRepository tripulanteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTripulanteMockMvc;

    private Tripulante tripulante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tripulante createEntity(EntityManager em) {
        Tripulante tripulante = new Tripulante().nombre(DEFAULT_NOMBRE).apellidos(DEFAULT_APELLIDOS).pasaporte(DEFAULT_PASAPORTE);
        return tripulante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tripulante createUpdatedEntity(EntityManager em) {
        Tripulante tripulante = new Tripulante().nombre(UPDATED_NOMBRE).apellidos(UPDATED_APELLIDOS).pasaporte(UPDATED_PASAPORTE);
        return tripulante;
    }

    @BeforeEach
    public void initTest() {
        tripulante = createEntity(em);
    }

    @Test
    @Transactional
    void createTripulante() throws Exception {
        int databaseSizeBeforeCreate = tripulanteRepository.findAll().size();
        // Create the Tripulante
        restTripulanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tripulante)))
            .andExpect(status().isCreated());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeCreate + 1);
        Tripulante testTripulante = tripulanteList.get(tripulanteList.size() - 1);
        assertThat(testTripulante.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testTripulante.getApellidos()).isEqualTo(DEFAULT_APELLIDOS);
        assertThat(testTripulante.getPasaporte()).isEqualTo(DEFAULT_PASAPORTE);
    }

    @Test
    @Transactional
    void createTripulanteWithExistingId() throws Exception {
        // Create the Tripulante with an existing ID
        tripulante.setId(1L);

        int databaseSizeBeforeCreate = tripulanteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTripulanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tripulante)))
            .andExpect(status().isBadRequest());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = tripulanteRepository.findAll().size();
        // set the field null
        tripulante.setNombre(null);

        // Create the Tripulante, which fails.

        restTripulanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tripulante)))
            .andExpect(status().isBadRequest());

        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApellidosIsRequired() throws Exception {
        int databaseSizeBeforeTest = tripulanteRepository.findAll().size();
        // set the field null
        tripulante.setApellidos(null);

        // Create the Tripulante, which fails.

        restTripulanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tripulante)))
            .andExpect(status().isBadRequest());

        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasaporteIsRequired() throws Exception {
        int databaseSizeBeforeTest = tripulanteRepository.findAll().size();
        // set the field null
        tripulante.setPasaporte(null);

        // Create the Tripulante, which fails.

        restTripulanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tripulante)))
            .andExpect(status().isBadRequest());

        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTripulantes() throws Exception {
        // Initialize the database
        tripulanteRepository.saveAndFlush(tripulante);

        // Get all the tripulanteList
        restTripulanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tripulante.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].apellidos").value(hasItem(DEFAULT_APELLIDOS)))
            .andExpect(jsonPath("$.[*].pasaporte").value(hasItem(DEFAULT_PASAPORTE)));
    }

    @Test
    @Transactional
    void getTripulante() throws Exception {
        // Initialize the database
        tripulanteRepository.saveAndFlush(tripulante);

        // Get the tripulante
        restTripulanteMockMvc
            .perform(get(ENTITY_API_URL_ID, tripulante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tripulante.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.apellidos").value(DEFAULT_APELLIDOS))
            .andExpect(jsonPath("$.pasaporte").value(DEFAULT_PASAPORTE));
    }

    @Test
    @Transactional
    void getNonExistingTripulante() throws Exception {
        // Get the tripulante
        restTripulanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTripulante() throws Exception {
        // Initialize the database
        tripulanteRepository.saveAndFlush(tripulante);

        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();

        // Update the tripulante
        Tripulante updatedTripulante = tripulanteRepository.findById(tripulante.getId()).get();
        // Disconnect from session so that the updates on updatedTripulante are not directly saved in db
        em.detach(updatedTripulante);
        updatedTripulante.nombre(UPDATED_NOMBRE).apellidos(UPDATED_APELLIDOS).pasaporte(UPDATED_PASAPORTE);

        restTripulanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTripulante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTripulante))
            )
            .andExpect(status().isOk());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
        Tripulante testTripulante = tripulanteList.get(tripulanteList.size() - 1);
        assertThat(testTripulante.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testTripulante.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testTripulante.getPasaporte()).isEqualTo(UPDATED_PASAPORTE);
    }

    @Test
    @Transactional
    void putNonExistingTripulante() throws Exception {
        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();
        tripulante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTripulanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tripulante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tripulante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTripulante() throws Exception {
        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();
        tripulante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTripulanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tripulante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTripulante() throws Exception {
        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();
        tripulante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTripulanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tripulante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTripulanteWithPatch() throws Exception {
        // Initialize the database
        tripulanteRepository.saveAndFlush(tripulante);

        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();

        // Update the tripulante using partial update
        Tripulante partialUpdatedTripulante = new Tripulante();
        partialUpdatedTripulante.setId(tripulante.getId());

        partialUpdatedTripulante.apellidos(UPDATED_APELLIDOS);

        restTripulanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTripulante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTripulante))
            )
            .andExpect(status().isOk());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
        Tripulante testTripulante = tripulanteList.get(tripulanteList.size() - 1);
        assertThat(testTripulante.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testTripulante.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testTripulante.getPasaporte()).isEqualTo(DEFAULT_PASAPORTE);
    }

    @Test
    @Transactional
    void fullUpdateTripulanteWithPatch() throws Exception {
        // Initialize the database
        tripulanteRepository.saveAndFlush(tripulante);

        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();

        // Update the tripulante using partial update
        Tripulante partialUpdatedTripulante = new Tripulante();
        partialUpdatedTripulante.setId(tripulante.getId());

        partialUpdatedTripulante.nombre(UPDATED_NOMBRE).apellidos(UPDATED_APELLIDOS).pasaporte(UPDATED_PASAPORTE);

        restTripulanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTripulante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTripulante))
            )
            .andExpect(status().isOk());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
        Tripulante testTripulante = tripulanteList.get(tripulanteList.size() - 1);
        assertThat(testTripulante.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testTripulante.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testTripulante.getPasaporte()).isEqualTo(UPDATED_PASAPORTE);
    }

    @Test
    @Transactional
    void patchNonExistingTripulante() throws Exception {
        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();
        tripulante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTripulanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tripulante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tripulante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTripulante() throws Exception {
        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();
        tripulante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTripulanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tripulante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTripulante() throws Exception {
        int databaseSizeBeforeUpdate = tripulanteRepository.findAll().size();
        tripulante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTripulanteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tripulante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tripulante in the database
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTripulante() throws Exception {
        // Initialize the database
        tripulanteRepository.saveAndFlush(tripulante);

        int databaseSizeBeforeDelete = tripulanteRepository.findAll().size();

        // Delete the tripulante
        restTripulanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, tripulante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tripulante> tripulanteList = tripulanteRepository.findAll();
        assertThat(tripulanteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
