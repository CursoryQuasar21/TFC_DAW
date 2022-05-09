package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Tripulante;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tripulante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TripulanteRepository extends JpaRepository<Tripulante, Long> {
    @Modifying
    @Query("update Tripulante tripulante set tripulante.avion = null where tripulante.avion.id = :avionId")
    void updateTripulantesDeleteAvionByAvionId(@Param("avionId") Long avionID);

    @Modifying
    @Query("update Tripulante tripulante set tripulante.avion.id = :avionId where tripulante.id = :tripulanteId")
    void updateTripulanteSaveAvionByAvionIdAndTripulanteId(@Param("avionId") Long avionId, @Param("tripulanteId") Long tripulanteId);
}
