package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Aeropuerto;
import com.mycompany.myapp.domain.Vuelo;
import com.mycompany.myapp.repository.AeropuertoRepository;
import com.mycompany.myapp.repository.VueloRepository;
import com.mycompany.myapp.service.VueloService;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vuelo}.
 */
@Service
@Transactional
public class VueloServiceImpl implements VueloService {

    private final Logger log = LoggerFactory.getLogger(VueloServiceImpl.class);

    private final VueloRepository vueloRepository;
    private final AeropuertoRepository aeropuertoRepository;

    public VueloServiceImpl(VueloRepository vueloRepository, AeropuertoRepository aeropuertoRepository) {
        this.vueloRepository = vueloRepository;
        this.aeropuertoRepository = aeropuertoRepository;
    }

    @Override
    public Vuelo save(Vuelo vuelo) {
        log.debug("Request to save Vuelo : {}", vuelo);
        log.debug("Request to save Vuelo Aeropuertos : {}", vuelo.getAeropuertos());
        log.debug("Request to save Vuelo to Aeropuertos : {}", vueloRepository.cargar());

        //Set<Aeropuerto> aeropuertos=new HashSet<>();
        for (Aeropuerto aeropuerto : aeropuertoRepository.findAll()) {
            log.debug("---------------------------------------------------");
            log.debug("Aeropuerto : {}", aeropuerto);
            for (Vuelo vueloA : aeropuerto.getVuelos()) {
                log.debug("Vuelo : {}", vueloA);
                if (vueloA.getId() == vuelo.getId()) {
                    log.debug("Este vuelo coincide con el Vuelo 1 : {}", vueloA.getAeropuertos());
                    log.debug("Este vuelo coincide con el Vuelo 2 : {}", vuelo.getAeropuertos());
                    log.debug("Vuelos del Aeropuerto : {}", aeropuerto.getVuelos());
                    aeropuerto.removeVuelo(vueloA);
                    log.debug("Este vuelo coincide con el Vuelo 2 : {}", aeropuerto.getVuelos());
                    log.debug("Este vuelo coincide con el Vuelo 1_1 : {}", vueloA.getAeropuertos());
                    log.debug("Este vuelo coincide con el Vuelo 2_2 : {}", vuelo.getAeropuertos());
                }
            }
            int cont = 1;
            for (Aeropuerto aeropuerto2 : vuelo.getAeropuertos()) {
                if (aeropuerto.getId() == aeropuerto2.getId() && cont == 2) {
                    log.debug("Vuelos del Aeropuerto : {}", aeropuerto.getVuelos());
                    aeropuerto.addVuelo(vuelo);
                    log.debug("Este vuelo coincide con el Vuelo 2 : {}", aeropuerto.getVuelos());
                }
                cont++;
            }
            log.debug("---------------------------------------------------");
        }
        // log.debug("Antes : {}", vuelo.getAeropuertos());
        // vuelo.setAeropuertos(aeropuertos);
        // log.debug("Despues : {}", vuelo.getAeropuertos());
        // for (Aeropuerto aeropuerto : aeropuertos) {
        //     vuelo.addAeropuerto(aeropuerto);
        // }
        // log.debug("Request to Aeropuertos 3 : {}", vuelo.getAeropuertos());
        return vueloRepository.save(vuelo);
    }

    @Override
    public Optional<Vuelo> partialUpdate(Vuelo vuelo) {
        log.debug("Request to partially update Vuelo : {}", vuelo);

        return vueloRepository
            .findById(vuelo.getId())
            .map(
                existingVuelo -> {
                    if (vuelo.getFechaOrigen() != null) {
                        existingVuelo.setFechaOrigen(vuelo.getFechaOrigen());
                    }
                    if (vuelo.getFechaDestino() != null) {
                        existingVuelo.setFechaDestino(vuelo.getFechaDestino());
                    }
                    if (vuelo.getPrecio() != null) {
                        existingVuelo.setPrecio(vuelo.getPrecio());
                    }

                    return existingVuelo;
                }
            )
            .map(vueloRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vuelo> findAll(Pageable pageable) {
        log.debug("Request to get all Vuelos");
        return vueloRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vuelo> findOne(Long id) {
        log.debug("Request to get Vuelo : {}", id);
        Optional<Vuelo> vuelo = vueloRepository.findById(id);
        log.debug("Aeropuertos of Vuelo : {}", vuelo.get().getAeropuertos());
        return vuelo;
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vuelo : {}", id);
        vueloRepository.deleteById(id);
    }
}
