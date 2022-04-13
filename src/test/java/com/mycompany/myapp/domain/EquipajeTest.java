package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EquipajeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Equipaje.class);
        Equipaje equipaje1 = new Equipaje();
        equipaje1.setId(1L);
        Equipaje equipaje2 = new Equipaje();
        equipaje2.setId(equipaje1.getId());
        assertThat(equipaje1).isEqualTo(equipaje2);
        equipaje2.setId(2L);
        assertThat(equipaje1).isNotEqualTo(equipaje2);
        equipaje1.setId(null);
        assertThat(equipaje1).isNotEqualTo(equipaje2);
    }
}
