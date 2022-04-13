package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Pasajero;
import com.mycompany.myapp.repository.PasajeroRepository;
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
 * Integration tests for the {@link PasajeroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PasajeroResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_APELLIDOS = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDOS = "BBBBBBBBBB";

    private static final String DEFAULT_PASAPORTE = "AAAAAAAAA";
    private static final String UPDATED_PASAPORTE = "BBBBBBBBB";

    private static final Integer DEFAULT_CANTIDAD_EQUIPAJE = 9;
    private static final Integer UPDATED_CANTIDAD_EQUIPAJE = 8;

    private static final Integer DEFAULT_NUMERO_ASIENTO = 10;
    private static final Integer UPDATED_NUMERO_ASIENTO = 11;

    private static final String ENTITY_API_URL = "/api/pasajeros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PasajeroRepository pasajeroRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPasajeroMockMvc;

    private Pasajero pasajero;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pasajero createEntity(EntityManager em) {
        Pasajero pasajero = new Pasajero()
            .nombre(DEFAULT_NOMBRE)
            .apellidos(DEFAULT_APELLIDOS)
            .pasaporte(DEFAULT_PASAPORTE)
            .cantidadEquipaje(DEFAULT_CANTIDAD_EQUIPAJE)
            .numeroAsiento(DEFAULT_NUMERO_ASIENTO);
        return pasajero;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pasajero createUpdatedEntity(EntityManager em) {
        Pasajero pasajero = new Pasajero()
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .pasaporte(UPDATED_PASAPORTE)
            .cantidadEquipaje(UPDATED_CANTIDAD_EQUIPAJE)
            .numeroAsiento(UPDATED_NUMERO_ASIENTO);
        return pasajero;
    }

    @BeforeEach
    public void initTest() {
        pasajero = createEntity(em);
    }

    @Test
    @Transactional
    void createPasajero() throws Exception {
        int databaseSizeBeforeCreate = pasajeroRepository.findAll().size();
        // Create the Pasajero
        restPasajeroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isCreated());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeCreate + 1);
        Pasajero testPasajero = pasajeroList.get(pasajeroList.size() - 1);
        assertThat(testPasajero.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testPasajero.getApellidos()).isEqualTo(DEFAULT_APELLIDOS);
        assertThat(testPasajero.getPasaporte()).isEqualTo(DEFAULT_PASAPORTE);
        assertThat(testPasajero.getCantidadEquipaje()).isEqualTo(DEFAULT_CANTIDAD_EQUIPAJE);
        assertThat(testPasajero.getNumeroAsiento()).isEqualTo(DEFAULT_NUMERO_ASIENTO);
    }

    @Test
    @Transactional
    void createPasajeroWithExistingId() throws Exception {
        // Create the Pasajero with an existing ID
        pasajero.setId(1L);

        int databaseSizeBeforeCreate = pasajeroRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPasajeroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isBadRequest());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = pasajeroRepository.findAll().size();
        // set the field null
        pasajero.setNombre(null);

        // Create the Pasajero, which fails.

        restPasajeroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isBadRequest());

        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApellidosIsRequired() throws Exception {
        int databaseSizeBeforeTest = pasajeroRepository.findAll().size();
        // set the field null
        pasajero.setApellidos(null);

        // Create the Pasajero, which fails.

        restPasajeroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isBadRequest());

        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPasaporteIsRequired() throws Exception {
        int databaseSizeBeforeTest = pasajeroRepository.findAll().size();
        // set the field null
        pasajero.setPasaporte(null);

        // Create the Pasajero, which fails.

        restPasajeroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isBadRequest());

        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadEquipajeIsRequired() throws Exception {
        int databaseSizeBeforeTest = pasajeroRepository.findAll().size();
        // set the field null
        pasajero.setCantidadEquipaje(null);

        // Create the Pasajero, which fails.

        restPasajeroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isBadRequest());

        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPasajeros() throws Exception {
        // Initialize the database
        pasajeroRepository.saveAndFlush(pasajero);

        // Get all the pasajeroList
        restPasajeroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pasajero.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].apellidos").value(hasItem(DEFAULT_APELLIDOS)))
            .andExpect(jsonPath("$.[*].pasaporte").value(hasItem(DEFAULT_PASAPORTE)))
            .andExpect(jsonPath("$.[*].cantidadEquipaje").value(hasItem(DEFAULT_CANTIDAD_EQUIPAJE)))
            .andExpect(jsonPath("$.[*].numeroAsiento").value(hasItem(DEFAULT_NUMERO_ASIENTO)));
    }

    @Test
    @Transactional
    void getPasajero() throws Exception {
        // Initialize the database
        pasajeroRepository.saveAndFlush(pasajero);

        // Get the pasajero
        restPasajeroMockMvc
            .perform(get(ENTITY_API_URL_ID, pasajero.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pasajero.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.apellidos").value(DEFAULT_APELLIDOS))
            .andExpect(jsonPath("$.pasaporte").value(DEFAULT_PASAPORTE))
            .andExpect(jsonPath("$.cantidadEquipaje").value(DEFAULT_CANTIDAD_EQUIPAJE))
            .andExpect(jsonPath("$.numeroAsiento").value(DEFAULT_NUMERO_ASIENTO));
    }

    @Test
    @Transactional
    void getNonExistingPasajero() throws Exception {
        // Get the pasajero
        restPasajeroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPasajero() throws Exception {
        // Initialize the database
        pasajeroRepository.saveAndFlush(pasajero);

        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();

        // Update the pasajero
        Pasajero updatedPasajero = pasajeroRepository.findById(pasajero.getId()).get();
        // Disconnect from session so that the updates on updatedPasajero are not directly saved in db
        em.detach(updatedPasajero);
        updatedPasajero
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .pasaporte(UPDATED_PASAPORTE)
            .cantidadEquipaje(UPDATED_CANTIDAD_EQUIPAJE)
            .numeroAsiento(UPDATED_NUMERO_ASIENTO);

        restPasajeroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPasajero.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPasajero))
            )
            .andExpect(status().isOk());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
        Pasajero testPasajero = pasajeroList.get(pasajeroList.size() - 1);
        assertThat(testPasajero.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testPasajero.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testPasajero.getPasaporte()).isEqualTo(UPDATED_PASAPORTE);
        assertThat(testPasajero.getCantidadEquipaje()).isEqualTo(UPDATED_CANTIDAD_EQUIPAJE);
        assertThat(testPasajero.getNumeroAsiento()).isEqualTo(UPDATED_NUMERO_ASIENTO);
    }

    @Test
    @Transactional
    void putNonExistingPasajero() throws Exception {
        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();
        pasajero.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPasajeroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pasajero.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pasajero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPasajero() throws Exception {
        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();
        pasajero.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPasajeroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pasajero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPasajero() throws Exception {
        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();
        pasajero.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPasajeroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePasajeroWithPatch() throws Exception {
        // Initialize the database
        pasajeroRepository.saveAndFlush(pasajero);

        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();

        // Update the pasajero using partial update
        Pasajero partialUpdatedPasajero = new Pasajero();
        partialUpdatedPasajero.setId(pasajero.getId());

        partialUpdatedPasajero.apellidos(UPDATED_APELLIDOS).numeroAsiento(UPDATED_NUMERO_ASIENTO);

        restPasajeroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPasajero.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPasajero))
            )
            .andExpect(status().isOk());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
        Pasajero testPasajero = pasajeroList.get(pasajeroList.size() - 1);
        assertThat(testPasajero.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testPasajero.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testPasajero.getPasaporte()).isEqualTo(DEFAULT_PASAPORTE);
        assertThat(testPasajero.getCantidadEquipaje()).isEqualTo(DEFAULT_CANTIDAD_EQUIPAJE);
        assertThat(testPasajero.getNumeroAsiento()).isEqualTo(UPDATED_NUMERO_ASIENTO);
    }

    @Test
    @Transactional
    void fullUpdatePasajeroWithPatch() throws Exception {
        // Initialize the database
        pasajeroRepository.saveAndFlush(pasajero);

        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();

        // Update the pasajero using partial update
        Pasajero partialUpdatedPasajero = new Pasajero();
        partialUpdatedPasajero.setId(pasajero.getId());

        partialUpdatedPasajero
            .nombre(UPDATED_NOMBRE)
            .apellidos(UPDATED_APELLIDOS)
            .pasaporte(UPDATED_PASAPORTE)
            .cantidadEquipaje(UPDATED_CANTIDAD_EQUIPAJE)
            .numeroAsiento(UPDATED_NUMERO_ASIENTO);

        restPasajeroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPasajero.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPasajero))
            )
            .andExpect(status().isOk());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
        Pasajero testPasajero = pasajeroList.get(pasajeroList.size() - 1);
        assertThat(testPasajero.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testPasajero.getApellidos()).isEqualTo(UPDATED_APELLIDOS);
        assertThat(testPasajero.getPasaporte()).isEqualTo(UPDATED_PASAPORTE);
        assertThat(testPasajero.getCantidadEquipaje()).isEqualTo(UPDATED_CANTIDAD_EQUIPAJE);
        assertThat(testPasajero.getNumeroAsiento()).isEqualTo(UPDATED_NUMERO_ASIENTO);
    }

    @Test
    @Transactional
    void patchNonExistingPasajero() throws Exception {
        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();
        pasajero.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPasajeroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pasajero.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pasajero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPasajero() throws Exception {
        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();
        pasajero.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPasajeroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pasajero))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPasajero() throws Exception {
        int databaseSizeBeforeUpdate = pasajeroRepository.findAll().size();
        pasajero.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPasajeroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(pasajero)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pasajero in the database
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePasajero() throws Exception {
        // Initialize the database
        pasajeroRepository.saveAndFlush(pasajero);

        int databaseSizeBeforeDelete = pasajeroRepository.findAll().size();

        // Delete the pasajero
        restPasajeroMockMvc
            .perform(delete(ENTITY_API_URL_ID, pasajero.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pasajero> pasajeroList = pasajeroRepository.findAll();
        assertThat(pasajeroList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
