package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Aeropuerto;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Aeropuerto entity.
 */
@Repository
public interface AeropuertoRepository extends JpaRepository<Aeropuerto, Long> {
    @Query(
        value = "select distinct aeropuerto from Aeropuerto aeropuerto left join fetch aeropuerto.vuelos",
        countQuery = "select count(distinct aeropuerto) from Aeropuerto aeropuerto"
    )
    Page<Aeropuerto> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct aeropuerto from Aeropuerto aeropuerto left join fetch aeropuerto.vuelos")
    List<Aeropuerto> findAllWithEagerRelationships();

    @Query("select aeropuerto from Aeropuerto aeropuerto left join fetch aeropuerto.vuelos where aeropuerto.id =:id")
    Optional<Aeropuerto> findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select aeropuerto from Aeropuerto aeropuerto where aeropuerto.ciudad.id=:ciudadId")
    Set<Aeropuerto> getAeropuertosByCiudadId(@Param("ciudadId") Long ciudadId);

    @Modifying
    @Query("update Aeropuerto aeropuerto set aeropuerto.ciudad = null where aeropuerto.ciudad.id = :ciudadId")
    void updateAeropuertosDeleteCiudadByCiudadId(@Param("ciudadId") Long ciudadId);

    @Modifying
    @Query("update Aeropuerto aeropuerto set aeropuerto.ciudad.id =:ciudadId where aeropuerto.id =:aeropuertoId")
    void updateAeropuertoSaveCiudadByCiudadIdAndAeropuertoId(@Param("ciudadId") Long ciudadId, @Param("aeropuertoId") Long aeropuertoId);
}
