package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Vuelo;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Vuelo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VueloRepository extends JpaRepository<Vuelo, Long> {
    //@Query("select vuelo.id from Vuelo vuelo join Aeropuerto rav on vuelo.id=rav.id where vuelo.id=1")

    //Casi correcto
    //@Query("SELECT ar.id FROM Vuelo vuelo inner join Aeropuerto ar on ar.vuelos.id=vuelo.id WHERE vuelo.id=1")

    @Query("SELECT ar.id FROM Aeropuerto ar join ar.vuelos vs where vs.id=2")
    Set<Long> cargar();
}
