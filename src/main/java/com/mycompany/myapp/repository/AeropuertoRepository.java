package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Aeropuerto;
import java.util.List;
import java.util.Optional;
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
}
