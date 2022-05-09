package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Equipaje;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Equipaje entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipajeRepository extends JpaRepository<Equipaje, Long> {
    @Modifying
    @Query("update Equipaje equipaje set equipaje.pasajero = null where equipaje.pasajero.id = :pasajeroId")
    void updateEquipajesDeletePasajeroByPasajeroId(@Param("pasajeroId") Long pasajeroID);

    @Modifying
    @Query("update Equipaje equipaje set equipaje.pasajero.id = :pasajeroId where equipaje.id = :equipajeId")
    void updateEquipajeSavePasajeroByPasajeroIdAndEquipajeId(@Param("pasajeroId") Long pasajeroId, @Param("equipajeId") Long equipajeId);
}
