package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Piloto;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Piloto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PilotoRepository extends JpaRepository<Piloto, Long> {
    @Modifying
    @Query("update Piloto piloto set piloto.avion = null where piloto.avion.id = :avionId")
    void updatePilotosDeleteAvionByAvionId(@Param("avionId") Long avionID);

    @Modifying
    @Query("update Piloto piloto set piloto.avion.id = :avionId where piloto.id = :pilotoId")
    void updatePilotoSaveAvionByAvionIdAndPilotoId(@Param("avionId") Long avionId, @Param("pilotoId") Long pilotoId);
}
