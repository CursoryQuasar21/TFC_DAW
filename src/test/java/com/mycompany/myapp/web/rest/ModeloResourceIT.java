package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Modelo;
import com.mycompany.myapp.repository.ModeloRepository;
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
 * Integration tests for the {@link ModeloResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ModeloResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final Integer DEFAULT_MOTORES = 1;
    private static final Integer UPDATED_MOTORES = 2;

    private static final Integer DEFAULT_CANTIDAD_PILOTOS = 1;
    private static final Integer UPDATED_CANTIDAD_PILOTOS = 2;

    private static final Integer DEFAULT_CANTIDAD_TRIPULANTES = 1;
    private static final Integer UPDATED_CANTIDAD_TRIPULANTES = 2;

    private static final Integer DEFAULT_CANTIDAD_PASAJEROS = 1;
    private static final Integer UPDATED_CANTIDAD_PASAJEROS = 2;

    private static final Integer DEFAULT_CANTIDAD_EQUIPAJES = 0;
    private static final Integer UPDATED_CANTIDAD_EQUIPAJES = 1;

    private static final String ENTITY_API_URL = "/api/modelos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ModeloRepository modeloRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restModeloMockMvc;

    private Modelo modelo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Modelo createEntity(EntityManager em) {
        Modelo modelo = new Modelo()
            .nombre(DEFAULT_NOMBRE)
            .motores(DEFAULT_MOTORES)
            .cantidadPilotos(DEFAULT_CANTIDAD_PILOTOS)
            .cantidadTripulantes(DEFAULT_CANTIDAD_TRIPULANTES)
            .cantidadPasajeros(DEFAULT_CANTIDAD_PASAJEROS)
            .cantidadEquipajes(DEFAULT_CANTIDAD_EQUIPAJES);
        return modelo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Modelo createUpdatedEntity(EntityManager em) {
        Modelo modelo = new Modelo()
            .nombre(UPDATED_NOMBRE)
            .motores(UPDATED_MOTORES)
            .cantidadPilotos(UPDATED_CANTIDAD_PILOTOS)
            .cantidadTripulantes(UPDATED_CANTIDAD_TRIPULANTES)
            .cantidadPasajeros(UPDATED_CANTIDAD_PASAJEROS)
            .cantidadEquipajes(UPDATED_CANTIDAD_EQUIPAJES);
        return modelo;
    }

    @BeforeEach
    public void initTest() {
        modelo = createEntity(em);
    }

    @Test
    @Transactional
    void createModelo() throws Exception {
        int databaseSizeBeforeCreate = modeloRepository.findAll().size();
        // Create the Modelo
        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isCreated());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeCreate + 1);
        Modelo testModelo = modeloList.get(modeloList.size() - 1);
        assertThat(testModelo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testModelo.getMotores()).isEqualTo(DEFAULT_MOTORES);
        assertThat(testModelo.getCantidadPilotos()).isEqualTo(DEFAULT_CANTIDAD_PILOTOS);
        assertThat(testModelo.getCantidadTripulantes()).isEqualTo(DEFAULT_CANTIDAD_TRIPULANTES);
        assertThat(testModelo.getCantidadPasajeros()).isEqualTo(DEFAULT_CANTIDAD_PASAJEROS);
        assertThat(testModelo.getCantidadEquipajes()).isEqualTo(DEFAULT_CANTIDAD_EQUIPAJES);
    }

    @Test
    @Transactional
    void createModeloWithExistingId() throws Exception {
        // Create the Modelo with an existing ID
        modelo.setId(1L);

        int databaseSizeBeforeCreate = modeloRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = modeloRepository.findAll().size();
        // set the field null
        modelo.setNombre(null);

        // Create the Modelo, which fails.

        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMotoresIsRequired() throws Exception {
        int databaseSizeBeforeTest = modeloRepository.findAll().size();
        // set the field null
        modelo.setMotores(null);

        // Create the Modelo, which fails.

        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadPilotosIsRequired() throws Exception {
        int databaseSizeBeforeTest = modeloRepository.findAll().size();
        // set the field null
        modelo.setCantidadPilotos(null);

        // Create the Modelo, which fails.

        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadTripulantesIsRequired() throws Exception {
        int databaseSizeBeforeTest = modeloRepository.findAll().size();
        // set the field null
        modelo.setCantidadTripulantes(null);

        // Create the Modelo, which fails.

        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadPasajerosIsRequired() throws Exception {
        int databaseSizeBeforeTest = modeloRepository.findAll().size();
        // set the field null
        modelo.setCantidadPasajeros(null);

        // Create the Modelo, which fails.

        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadEquipajesIsRequired() throws Exception {
        int databaseSizeBeforeTest = modeloRepository.findAll().size();
        // set the field null
        modelo.setCantidadEquipajes(null);

        // Create the Modelo, which fails.

        restModeloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isBadRequest());

        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllModelos() throws Exception {
        // Initialize the database
        modeloRepository.saveAndFlush(modelo);

        // Get all the modeloList
        restModeloMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(modelo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].motores").value(hasItem(DEFAULT_MOTORES)))
            .andExpect(jsonPath("$.[*].cantidadPilotos").value(hasItem(DEFAULT_CANTIDAD_PILOTOS)))
            .andExpect(jsonPath("$.[*].cantidadTripulantes").value(hasItem(DEFAULT_CANTIDAD_TRIPULANTES)))
            .andExpect(jsonPath("$.[*].cantidadPasajeros").value(hasItem(DEFAULT_CANTIDAD_PASAJEROS)))
            .andExpect(jsonPath("$.[*].cantidadEquipajes").value(hasItem(DEFAULT_CANTIDAD_EQUIPAJES)));
    }

    @Test
    @Transactional
    void getModelo() throws Exception {
        // Initialize the database
        modeloRepository.saveAndFlush(modelo);

        // Get the modelo
        restModeloMockMvc
            .perform(get(ENTITY_API_URL_ID, modelo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(modelo.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.motores").value(DEFAULT_MOTORES))
            .andExpect(jsonPath("$.cantidadPilotos").value(DEFAULT_CANTIDAD_PILOTOS))
            .andExpect(jsonPath("$.cantidadTripulantes").value(DEFAULT_CANTIDAD_TRIPULANTES))
            .andExpect(jsonPath("$.cantidadPasajeros").value(DEFAULT_CANTIDAD_PASAJEROS))
            .andExpect(jsonPath("$.cantidadEquipajes").value(DEFAULT_CANTIDAD_EQUIPAJES));
    }

    @Test
    @Transactional
    void getNonExistingModelo() throws Exception {
        // Get the modelo
        restModeloMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewModelo() throws Exception {
        // Initialize the database
        modeloRepository.saveAndFlush(modelo);

        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();

        // Update the modelo
        Modelo updatedModelo = modeloRepository.findById(modelo.getId()).get();
        // Disconnect from session so that the updates on updatedModelo are not directly saved in db
        em.detach(updatedModelo);
        updatedModelo
            .nombre(UPDATED_NOMBRE)
            .motores(UPDATED_MOTORES)
            .cantidadPilotos(UPDATED_CANTIDAD_PILOTOS)
            .cantidadTripulantes(UPDATED_CANTIDAD_TRIPULANTES)
            .cantidadPasajeros(UPDATED_CANTIDAD_PASAJEROS)
            .cantidadEquipajes(UPDATED_CANTIDAD_EQUIPAJES);

        restModeloMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedModelo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedModelo))
            )
            .andExpect(status().isOk());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
        Modelo testModelo = modeloList.get(modeloList.size() - 1);
        assertThat(testModelo.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testModelo.getMotores()).isEqualTo(UPDATED_MOTORES);
        assertThat(testModelo.getCantidadPilotos()).isEqualTo(UPDATED_CANTIDAD_PILOTOS);
        assertThat(testModelo.getCantidadTripulantes()).isEqualTo(UPDATED_CANTIDAD_TRIPULANTES);
        assertThat(testModelo.getCantidadPasajeros()).isEqualTo(UPDATED_CANTIDAD_PASAJEROS);
        assertThat(testModelo.getCantidadEquipajes()).isEqualTo(UPDATED_CANTIDAD_EQUIPAJES);
    }

    @Test
    @Transactional
    void putNonExistingModelo() throws Exception {
        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();
        modelo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModeloMockMvc
            .perform(
                put(ENTITY_API_URL_ID, modelo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modelo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchModelo() throws Exception {
        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();
        modelo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeloMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(modelo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamModelo() throws Exception {
        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();
        modelo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeloMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateModeloWithPatch() throws Exception {
        // Initialize the database
        modeloRepository.saveAndFlush(modelo);

        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();

        // Update the modelo using partial update
        Modelo partialUpdatedModelo = new Modelo();
        partialUpdatedModelo.setId(modelo.getId());

        partialUpdatedModelo.cantidadPilotos(UPDATED_CANTIDAD_PILOTOS).cantidadTripulantes(UPDATED_CANTIDAD_TRIPULANTES);

        restModeloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModelo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModelo))
            )
            .andExpect(status().isOk());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
        Modelo testModelo = modeloList.get(modeloList.size() - 1);
        assertThat(testModelo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testModelo.getMotores()).isEqualTo(DEFAULT_MOTORES);
        assertThat(testModelo.getCantidadPilotos()).isEqualTo(UPDATED_CANTIDAD_PILOTOS);
        assertThat(testModelo.getCantidadTripulantes()).isEqualTo(UPDATED_CANTIDAD_TRIPULANTES);
        assertThat(testModelo.getCantidadPasajeros()).isEqualTo(DEFAULT_CANTIDAD_PASAJEROS);
        assertThat(testModelo.getCantidadEquipajes()).isEqualTo(DEFAULT_CANTIDAD_EQUIPAJES);
    }

    @Test
    @Transactional
    void fullUpdateModeloWithPatch() throws Exception {
        // Initialize the database
        modeloRepository.saveAndFlush(modelo);

        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();

        // Update the modelo using partial update
        Modelo partialUpdatedModelo = new Modelo();
        partialUpdatedModelo.setId(modelo.getId());

        partialUpdatedModelo
            .nombre(UPDATED_NOMBRE)
            .motores(UPDATED_MOTORES)
            .cantidadPilotos(UPDATED_CANTIDAD_PILOTOS)
            .cantidadTripulantes(UPDATED_CANTIDAD_TRIPULANTES)
            .cantidadPasajeros(UPDATED_CANTIDAD_PASAJEROS)
            .cantidadEquipajes(UPDATED_CANTIDAD_EQUIPAJES);

        restModeloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedModelo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedModelo))
            )
            .andExpect(status().isOk());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
        Modelo testModelo = modeloList.get(modeloList.size() - 1);
        assertThat(testModelo.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testModelo.getMotores()).isEqualTo(UPDATED_MOTORES);
        assertThat(testModelo.getCantidadPilotos()).isEqualTo(UPDATED_CANTIDAD_PILOTOS);
        assertThat(testModelo.getCantidadTripulantes()).isEqualTo(UPDATED_CANTIDAD_TRIPULANTES);
        assertThat(testModelo.getCantidadPasajeros()).isEqualTo(UPDATED_CANTIDAD_PASAJEROS);
        assertThat(testModelo.getCantidadEquipajes()).isEqualTo(UPDATED_CANTIDAD_EQUIPAJES);
    }

    @Test
    @Transactional
    void patchNonExistingModelo() throws Exception {
        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();
        modelo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restModeloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, modelo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modelo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchModelo() throws Exception {
        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();
        modelo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(modelo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamModelo() throws Exception {
        int databaseSizeBeforeUpdate = modeloRepository.findAll().size();
        modelo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restModeloMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(modelo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Modelo in the database
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteModelo() throws Exception {
        // Initialize the database
        modeloRepository.saveAndFlush(modelo);

        int databaseSizeBeforeDelete = modeloRepository.findAll().size();

        // Delete the modelo
        restModeloMockMvc
            .perform(delete(ENTITY_API_URL_ID, modelo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Modelo> modeloList = modeloRepository.findAll();
        assertThat(modeloList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
