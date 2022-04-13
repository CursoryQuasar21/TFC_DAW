package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Equipaje;
import com.mycompany.myapp.repository.EquipajeRepository;
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
 * Integration tests for the {@link EquipajeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EquipajeResourceIT {

    private static final String DEFAULT_TIPO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/equipajes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EquipajeRepository equipajeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEquipajeMockMvc;

    private Equipaje equipaje;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Equipaje createEntity(EntityManager em) {
        Equipaje equipaje = new Equipaje().tipo(DEFAULT_TIPO);
        return equipaje;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Equipaje createUpdatedEntity(EntityManager em) {
        Equipaje equipaje = new Equipaje().tipo(UPDATED_TIPO);
        return equipaje;
    }

    @BeforeEach
    public void initTest() {
        equipaje = createEntity(em);
    }

    @Test
    @Transactional
    void createEquipaje() throws Exception {
        int databaseSizeBeforeCreate = equipajeRepository.findAll().size();
        // Create the Equipaje
        restEquipajeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(equipaje)))
            .andExpect(status().isCreated());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeCreate + 1);
        Equipaje testEquipaje = equipajeList.get(equipajeList.size() - 1);
        assertThat(testEquipaje.getTipo()).isEqualTo(DEFAULT_TIPO);
    }

    @Test
    @Transactional
    void createEquipajeWithExistingId() throws Exception {
        // Create the Equipaje with an existing ID
        equipaje.setId(1L);

        int databaseSizeBeforeCreate = equipajeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEquipajeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(equipaje)))
            .andExpect(status().isBadRequest());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTipoIsRequired() throws Exception {
        int databaseSizeBeforeTest = equipajeRepository.findAll().size();
        // set the field null
        equipaje.setTipo(null);

        // Create the Equipaje, which fails.

        restEquipajeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(equipaje)))
            .andExpect(status().isBadRequest());

        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEquipajes() throws Exception {
        // Initialize the database
        equipajeRepository.saveAndFlush(equipaje);

        // Get all the equipajeList
        restEquipajeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(equipaje.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO)));
    }

    @Test
    @Transactional
    void getEquipaje() throws Exception {
        // Initialize the database
        equipajeRepository.saveAndFlush(equipaje);

        // Get the equipaje
        restEquipajeMockMvc
            .perform(get(ENTITY_API_URL_ID, equipaje.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(equipaje.getId().intValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO));
    }

    @Test
    @Transactional
    void getNonExistingEquipaje() throws Exception {
        // Get the equipaje
        restEquipajeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEquipaje() throws Exception {
        // Initialize the database
        equipajeRepository.saveAndFlush(equipaje);

        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();

        // Update the equipaje
        Equipaje updatedEquipaje = equipajeRepository.findById(equipaje.getId()).get();
        // Disconnect from session so that the updates on updatedEquipaje are not directly saved in db
        em.detach(updatedEquipaje);
        updatedEquipaje.tipo(UPDATED_TIPO);

        restEquipajeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEquipaje.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEquipaje))
            )
            .andExpect(status().isOk());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
        Equipaje testEquipaje = equipajeList.get(equipajeList.size() - 1);
        assertThat(testEquipaje.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void putNonExistingEquipaje() throws Exception {
        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();
        equipaje.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEquipajeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, equipaje.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(equipaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEquipaje() throws Exception {
        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();
        equipaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEquipajeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(equipaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEquipaje() throws Exception {
        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();
        equipaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEquipajeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(equipaje)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEquipajeWithPatch() throws Exception {
        // Initialize the database
        equipajeRepository.saveAndFlush(equipaje);

        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();

        // Update the equipaje using partial update
        Equipaje partialUpdatedEquipaje = new Equipaje();
        partialUpdatedEquipaje.setId(equipaje.getId());

        partialUpdatedEquipaje.tipo(UPDATED_TIPO);

        restEquipajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEquipaje.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEquipaje))
            )
            .andExpect(status().isOk());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
        Equipaje testEquipaje = equipajeList.get(equipajeList.size() - 1);
        assertThat(testEquipaje.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void fullUpdateEquipajeWithPatch() throws Exception {
        // Initialize the database
        equipajeRepository.saveAndFlush(equipaje);

        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();

        // Update the equipaje using partial update
        Equipaje partialUpdatedEquipaje = new Equipaje();
        partialUpdatedEquipaje.setId(equipaje.getId());

        partialUpdatedEquipaje.tipo(UPDATED_TIPO);

        restEquipajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEquipaje.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEquipaje))
            )
            .andExpect(status().isOk());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
        Equipaje testEquipaje = equipajeList.get(equipajeList.size() - 1);
        assertThat(testEquipaje.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void patchNonExistingEquipaje() throws Exception {
        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();
        equipaje.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEquipajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, equipaje.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(equipaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEquipaje() throws Exception {
        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();
        equipaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEquipajeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(equipaje))
            )
            .andExpect(status().isBadRequest());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEquipaje() throws Exception {
        int databaseSizeBeforeUpdate = equipajeRepository.findAll().size();
        equipaje.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEquipajeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(equipaje)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Equipaje in the database
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEquipaje() throws Exception {
        // Initialize the database
        equipajeRepository.saveAndFlush(equipaje);

        int databaseSizeBeforeDelete = equipajeRepository.findAll().size();

        // Delete the equipaje
        restEquipajeMockMvc
            .perform(delete(ENTITY_API_URL_ID, equipaje.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Equipaje> equipajeList = equipajeRepository.findAll();
        assertThat(equipajeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
