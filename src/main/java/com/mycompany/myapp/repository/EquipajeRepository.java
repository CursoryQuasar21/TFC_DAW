package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Equipaje;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Equipaje entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EquipajeRepository extends JpaRepository<Equipaje, Long> {}
