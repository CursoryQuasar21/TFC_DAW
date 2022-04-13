package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ciudad.
 */
@Entity
@Table(name = "ciudad")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ciudad implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 30)
    @Column(name = "nombre", length = 30, nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "ciudad")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "avions", "vuelos", "ciudad" }, allowSetters = true)
    private Set<Aeropuerto> aeropuertos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "ciudads" }, allowSetters = true)
    private Pais pais;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ciudad id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Ciudad nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<Aeropuerto> getAeropuertos() {
        return this.aeropuertos;
    }

    public Ciudad aeropuertos(Set<Aeropuerto> aeropuertos) {
        this.setAeropuertos(aeropuertos);
        return this;
    }

    public Ciudad addAeropuerto(Aeropuerto aeropuerto) {
        this.aeropuertos.add(aeropuerto);
        aeropuerto.setCiudad(this);
        return this;
    }

    public Ciudad removeAeropuerto(Aeropuerto aeropuerto) {
        this.aeropuertos.remove(aeropuerto);
        aeropuerto.setCiudad(null);
        return this;
    }

    public void setAeropuertos(Set<Aeropuerto> aeropuertos) {
        if (this.aeropuertos != null) {
            this.aeropuertos.forEach(i -> i.setCiudad(null));
        }
        if (aeropuertos != null) {
            aeropuertos.forEach(i -> i.setCiudad(this));
        }
        this.aeropuertos = aeropuertos;
    }

    public Pais getPais() {
        return this.pais;
    }

    public Ciudad pais(Pais pais) {
        this.setPais(pais);
        return this;
    }

    public void setPais(Pais pais) {
        this.pais = pais;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ciudad)) {
            return false;
        }
        return id != null && id.equals(((Ciudad) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ciudad{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}
