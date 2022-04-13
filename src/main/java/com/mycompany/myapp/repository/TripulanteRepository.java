package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Tripulante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tripulante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TripulanteRepository extends JpaRepository<Tripulante, Long> {}
