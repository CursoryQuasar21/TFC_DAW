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
 * A Aeropuerto.
 */
@Entity
@Table(name = "aeropuerto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Aeropuerto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 3, max = 30)
    @Column(name = "nombre", length = 30, nullable = false)
    private String nombre;

    @OneToMany(mappedBy = "aeropuerto")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pilotos", "tripulantes", "pasajeros", "vuelo", "modelo", "aeropuerto" }, allowSetters = true)
    private Set<Avion> avions = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_aeropuerto__vuelo",
        joinColumns = @JoinColumn(name = "aeropuerto_id"),
        inverseJoinColumns = @JoinColumn(name = "vuelo_id")
    )
    @JsonIgnoreProperties(value = { "avion", "aeropuertos" }, allowSetters = true)
    private Set<Vuelo> vuelos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "aeropuertos", "pais" }, allowSetters = true)
    private Ciudad ciudad;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Aeropuerto id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Aeropuerto nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Set<Avion> getAvions() {
        return this.avions;
    }

    public Aeropuerto avions(Set<Avion> avions) {
        this.setAvions(avions);
        return this;
    }

    public Aeropuerto addAvion(Avion avion) {
        this.avions.add(avion);
        avion.setAeropuerto(this);
        return this;
    }

    public Aeropuerto removeAvion(Avion avion) {
        this.avions.remove(avion);
        avion.setAeropuerto(null);
        return this;
    }

    public void setAvions(Set<Avion> avions) {
        if (this.avions != null) {
            this.avions.forEach(i -> i.setAeropuerto(null));
        }
        if (avions != null) {
            avions.forEach(i -> i.setAeropuerto(this));
        }
        this.avions = avions;
    }

    public Set<Vuelo> getVuelos() {
        return this.vuelos;
    }

    public Aeropuerto vuelos(Set<Vuelo> vuelos) {
        this.setVuelos(vuelos);
        return this;
    }

    public Aeropuerto addVuelo(Vuelo vuelo) {
        this.vuelos.add(vuelo);
        vuelo.getAeropuertos().add(this);
        return this;
    }

    public Aeropuerto removeVuelo(Vuelo vuelo) {
        this.vuelos.remove(vuelo);
        vuelo.getAeropuertos().remove(this);
        return this;
    }

    public void setVuelos(Set<Vuelo> vuelos) {
        this.vuelos = vuelos;
    }

    public Ciudad getCiudad() {
        return this.ciudad;
    }

    public Aeropuerto ciudad(Ciudad ciudad) {
        this.setCiudad(ciudad);
        return this;
    }

    public void setCiudad(Ciudad ciudad) {
        this.ciudad = ciudad;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Aeropuerto)) {
            return false;
        }
        return id != null && id.equals(((Aeropuerto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Aeropuerto{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            "}";
    }
}
