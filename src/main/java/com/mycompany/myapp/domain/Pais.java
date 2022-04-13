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
 * A Pais.
 */
@Entity
@Table(name = "pais")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pais implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 30)
    @Column(name = "nombre", length = 30, nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "pais")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "aeropuertos", "pais" }, allowSetters = true)
    private Set<Ciudad> ciudads = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pais id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Pais nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<Ciudad> getCiudads() {
        return this.ciudads;
    }

    public Pais ciudads(Set<Ciudad> ciudads) {
        this.setCiudads(ciudads);
        return this;
    }

    public Pais addCiudad(Ciudad ciudad) {
        this.ciudads.add(ciudad);
        ciudad.setPais(this);
        return this;
    }

    public Pais removeCiudad(Ciudad ciudad) {
        this.ciudads.remove(ciudad);
        ciudad.setPais(null);
        return this;
    }

    public void setCiudads(Set<Ciudad> ciudads) {
        if (this.ciudads != null) {
            this.ciudads.forEach(i -> i.setPais(null));
        }
        if (ciudads != null) {
            ciudads.forEach(i -> i.setPais(this));
        }
        this.ciudads = ciudads;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pais)) {
            return false;
        }
        return id != null && id.equals(((Pais) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pais{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}
