package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Aeropuerto;
import com.mycompany.myapp.repository.AeropuertoRepository;
import com.mycompany.myapp.service.AeropuertoService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AeropuertoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AeropuertoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/aeropuertos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AeropuertoRepository aeropuertoRepository;

    @Mock
    private AeropuertoRepository aeropuertoRepositoryMock;

    @Mock
    private AeropuertoService aeropuertoServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAeropuertoMockMvc;

    private Aeropuerto aeropuerto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aeropuerto createEntity(EntityManager em) {
        Aeropuerto aeropuerto = new Aeropuerto().nombre(DEFAULT_NOMBRE);
        return aeropuerto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aeropuerto createUpdatedEntity(EntityManager em) {
        Aeropuerto aeropuerto = new Aeropuerto().nombre(UPDATED_NOMBRE);
        return aeropuerto;
    }

    @BeforeEach
    public void initTest() {
        aeropuerto = createEntity(em);
    }

    @Test
    @Transactional
    void createAeropuerto() throws Exception {
        int databaseSizeBeforeCreate = aeropuertoRepository.findAll().size();
        // Create the Aeropuerto
        restAeropuertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aeropuerto)))
            .andExpect(status().isCreated());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeCreate + 1);
        Aeropuerto testAeropuerto = aeropuertoList.get(aeropuertoList.size() - 1);
        assertThat(testAeropuerto.getNombre()).isEqualTo(DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    void createAeropuertoWithExistingId() throws Exception {
        // Create the Aeropuerto with an existing ID
        aeropuerto.setId(1L);

        int databaseSizeBeforeCreate = aeropuertoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAeropuertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aeropuerto)))
            .andExpect(status().isBadRequest());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = aeropuertoRepository.findAll().size();
        // set the field null
        aeropuerto.setNombre(null);

        // Create the Aeropuerto, which fails.

        restAeropuertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aeropuerto)))
            .andExpect(status().isBadRequest());

        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAeropuertos() throws Exception {
        // Initialize the database
        aeropuertoRepository.saveAndFlush(aeropuerto);

        // Get all the aeropuertoList
        restAeropuertoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aeropuerto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAeropuertosWithEagerRelationshipsIsEnabled() throws Exception {
        when(aeropuertoServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAeropuertoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(aeropuertoServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAeropuertosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(aeropuertoServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAeropuertoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(aeropuertoServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getAeropuerto() throws Exception {
        // Initialize the database
        aeropuertoRepository.saveAndFlush(aeropuerto);

        // Get the aeropuerto
        restAeropuertoMockMvc
            .perform(get(ENTITY_API_URL_ID, aeropuerto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(aeropuerto.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE));
    }

    @Test
    @Transactional
    void getNonExistingAeropuerto() throws Exception {
        // Get the aeropuerto
        restAeropuertoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAeropuerto() throws Exception {
        // Initialize the database
        aeropuertoRepository.saveAndFlush(aeropuerto);

        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();

        // Update the aeropuerto
        Aeropuerto updatedAeropuerto = aeropuertoRepository.findById(aeropuerto.getId()).get();
        // Disconnect from session so that the updates on updatedAeropuerto are not directly saved in db
        em.detach(updatedAeropuerto);
        updatedAeropuerto.nombre(UPDATED_NOMBRE);

        restAeropuertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAeropuerto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAeropuerto))
            )
            .andExpect(status().isOk());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
        Aeropuerto testAeropuerto = aeropuertoList.get(aeropuertoList.size() - 1);
        assertThat(testAeropuerto.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void putNonExistingAeropuerto() throws Exception {
        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();
        aeropuerto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAeropuertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, aeropuerto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aeropuerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAeropuerto() throws Exception {
        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();
        aeropuerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAeropuertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aeropuerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAeropuerto() throws Exception {
        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();
        aeropuerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAeropuertoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aeropuerto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAeropuertoWithPatch() throws Exception {
        // Initialize the database
        aeropuertoRepository.saveAndFlush(aeropuerto);

        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();

        // Update the aeropuerto using partial update
        Aeropuerto partialUpdatedAeropuerto = new Aeropuerto();
        partialUpdatedAeropuerto.setId(aeropuerto.getId());

        partialUpdatedAeropuerto.nombre(UPDATED_NOMBRE);

        restAeropuertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAeropuerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAeropuerto))
            )
            .andExpect(status().isOk());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
        Aeropuerto testAeropuerto = aeropuertoList.get(aeropuertoList.size() - 1);
        assertThat(testAeropuerto.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void fullUpdateAeropuertoWithPatch() throws Exception {
        // Initialize the database
        aeropuertoRepository.saveAndFlush(aeropuerto);

        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();

        // Update the aeropuerto using partial update
        Aeropuerto partialUpdatedAeropuerto = new Aeropuerto();
        partialUpdatedAeropuerto.setId(aeropuerto.getId());

        partialUpdatedAeropuerto.nombre(UPDATED_NOMBRE);

        restAeropuertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAeropuerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAeropuerto))
            )
            .andExpect(status().isOk());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
        Aeropuerto testAeropuerto = aeropuertoList.get(aeropuertoList.size() - 1);
        assertThat(testAeropuerto.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    void patchNonExistingAeropuerto() throws Exception {
        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();
        aeropuerto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAeropuertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, aeropuerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aeropuerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAeropuerto() throws Exception {
        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();
        aeropuerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAeropuertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aeropuerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAeropuerto() throws Exception {
        int databaseSizeBeforeUpdate = aeropuertoRepository.findAll().size();
        aeropuerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAeropuertoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(aeropuerto))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aeropuerto in the database
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAeropuerto() throws Exception {
        // Initialize the database
        aeropuertoRepository.saveAndFlush(aeropuerto);

        int databaseSizeBeforeDelete = aeropuertoRepository.findAll().size();

        // Delete the aeropuerto
        restAeropuertoMockMvc
            .perform(delete(ENTITY_API_URL_ID, aeropuerto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Aeropuerto> aeropuertoList = aeropuertoRepository.findAll();
        assertThat(aeropuertoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
