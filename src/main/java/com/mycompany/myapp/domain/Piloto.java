package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Piloto.
 */
@Entity
@Table(name = "piloto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Piloto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 15)
    @Column(name = "nombre", length = 15, nullable = false)
    private String nombre;

    @NotNull
    @Size(min = 3, max = 40)
    @Column(name = "apellidos", length = 40, nullable = false)
    private String apellidos;

    @NotNull
    @Size(min = 9, max = 9)
    @Column(name = "pasaporte", length = 9, nullable = false)
    private String pasaporte;

    @ManyToOne
    @JsonIgnoreProperties(value = { "pilotos", "tripulantes", "pasajeros", "vuelo", "modelo", "aeropuerto" }, allowSetters = true)
    private Avion avion;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Piloto id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Piloto nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return this.apellidos;
    }

    public Piloto apellidos(String apellidos) {
        this.apellidos = apellidos;
        return this;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getPasaporte() {
        return this.pasaporte;
    }

    public Piloto pasaporte(String pasaporte) {
        this.pasaporte = pasaporte;
        return this;
    }

    public void setPasaporte(String pasaporte) {
        this.pasaporte = pasaporte;
    }

    public Avion getAvion() {
        return this.avion;
    }

    public Piloto avion(Avion avion) {
        this.setAvion(avion);
        return this;
    }

    public void setAvion(Avion avion) {
        this.avion = avion;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Piloto)) {
            return false;
        }
        return id != null && id.equals(((Piloto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Piloto{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellidos='" + getApellidos() + "'" +
            ", pasaporte='" + getPasaporte() + "'" +
            "}";
    }
}
