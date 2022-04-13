package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PasajeroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pasajero.class);
        Pasajero pasajero1 = new Pasajero();
        pasajero1.setId(1L);
        Pasajero pasajero2 = new Pasajero();
        pasajero2.setId(pasajero1.getId());
        assertThat(pasajero1).isEqualTo(pasajero2);
        pasajero2.setId(2L);
        assertThat(pasajero1).isNotEqualTo(pasajero2);
        pasajero1.setId(null);
        assertThat(pasajero1).isNotEqualTo(pasajero2);
    }
}
