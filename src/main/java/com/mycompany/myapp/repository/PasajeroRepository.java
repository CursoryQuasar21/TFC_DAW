package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Pasajero;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Pasajero entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PasajeroRepository extends JpaRepository<Pasajero, Long> {
    @Modifying
    @Query("update Pasajero pasajero set pasajero.avion = null where pasajero.avion.id = :avionId")
    void updatePasajerosDeleteAvionByAvionId(@Param("avionId") Long avionID);

    @Modifying
    @Query("update Pasajero pasajero set pasajero.avion.id = :avionId where pasajero.id = :pasajeroId")
    void updatePasajeroSaveAvionByAvionIdAndPasajeroId(@Param("avionId") Long avionId, @Param("pasajeroId") Long pasajeroId);
}
