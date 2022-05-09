package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Ciudad;
import com.mycompany.myapp.domain.Ciudad;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ciudad entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CiudadRepository extends JpaRepository<Ciudad, Long> {
    @Query("select ciudad from Ciudad ciudad where ciudad.pais.id=:paisId")
    Set<Ciudad> getCiudadesByCiudadId(@Param("paisId") Long paisId);

    @Modifying
    @Query("update Ciudad ciudad set ciudad.pais = null where ciudad.pais.id = :paisId")
    void updateCiudadesDeletePaisByPaisId(@Param("paisId") Long paisID);

    @Modifying
    @Query("update Ciudad ciudad set ciudad.pais.id = :paisId where ciudad.id = :ciudadId")
    void updateCiudadSavePaisByPaisIdAndCiudadId(@Param("paisId") Long paisId, @Param("ciudadId") Long ciudadId);
}
