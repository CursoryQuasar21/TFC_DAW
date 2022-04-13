package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Avion.
 */
@Entity
@Table(name = "avion")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Avion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @DecimalMin(value = "1")
    @Column(name = "coste_fabricacion", nullable = false)
    private Double costeFabricacion;

    @NotNull
    @Column(name = "anio_fabricacion", nullable = false)
    private Instant anioFabricacion;

    @OneToMany(mappedBy = "avion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "avion" }, allowSetters = true)
    private Set<Piloto> pilotos = new HashSet<>();

    @OneToMany(mappedBy = "avion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "avion" }, allowSetters = true)
    private Set<Tripulante> tripulantes = new HashSet<>();

    @OneToMany(mappedBy = "avion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "equipajes", "avion" }, allowSetters = true)
    private Set<Pasajero> pasajeros = new HashSet<>();

    @JsonIgnoreProperties(value = { "avion", "aeropuertos" }, allowSetters = true)
    @OneToOne(mappedBy = "avion")
    private Vuelo vuelo;

    @ManyToOne
    @JsonIgnoreProperties(value = { "avions" }, allowSetters = true)
    private Modelo modelo;

    @ManyToOne
    @JsonIgnoreProperties(value = { "avions", "vuelos", "ciudad" }, allowSetters = true)
    private Aeropuerto aeropuerto;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Avion id(Long id) {
        this.id = id;
        return this;
    }

    public Double getCosteFabricacion() {
        return this.costeFabricacion;
    }

    public Avion costeFabricacion(Double costeFabricacion) {
        this.costeFabricacion = costeFabricacion;
        return this;
    }

    public void setCosteFabricacion(Double costeFabricacion) {
        this.costeFabricacion = costeFabricacion;
    }

    public Instant getAnioFabricacion() {
        return this.anioFabricacion;
    }

    public Avion anioFabricacion(Instant anioFabricacion) {
        this.anioFabricacion = anioFabricacion;
        return this;
    }

    public void setAnioFabricacion(Instant anioFabricacion) {
        this.anioFabricacion = anioFabricacion;
    }

    public Set<Piloto> getPilotos() {
        return this.pilotos;
    }

    public Avion pilotos(Set<Piloto> pilotos) {
        this.setPilotos(pilotos);
        return this;
    }

    public Avion addPiloto(Piloto piloto) {
        this.pilotos.add(piloto);
        piloto.setAvion(this);
        return this;
    }

    public Avion removePiloto(Piloto piloto) {
        this.pilotos.remove(piloto);
        piloto.setAvion(null);
        return this;
    }

    public void setPilotos(Set<Piloto> pilotos) {
        if (this.pilotos != null) {
            this.pilotos.forEach(i -> i.setAvion(null));
        }
        if (pilotos != null) {
            pilotos.forEach(i -> i.setAvion(this));
        }
        this.pilotos = pilotos;
    }

    public Set<Tripulante> getTripulantes() {
        return this.tripulantes;
    }

    public Avion tripulantes(Set<Tripulante> tripulantes) {
        this.setTripulantes(tripulantes);
        return this;
    }

    public Avion addTripulante(Tripulante tripulante) {
        this.tripulantes.add(tripulante);
        tripulante.setAvion(this);
        return this;
    }

    public Avion removeTripulante(Tripulante tripulante) {
        this.tripulantes.remove(tripulante);
        tripulante.setAvion(null);
        return this;
    }

    public void setTripulantes(Set<Tripulante> tripulantes) {
        if (this.tripulantes != null) {
            this.tripulantes.forEach(i -> i.setAvion(null));
        }
        if (tripulantes != null) {
            tripulantes.forEach(i -> i.setAvion(this));
        }
        this.tripulantes = tripulantes;
    }

    public Set<Pasajero> getPasajeros() {
        return this.pasajeros;
    }

    public Avion pasajeros(Set<Pasajero> pasajeros) {
        this.setPasajeros(pasajeros);
        return this;
    }

    public Avion addPasajero(Pasajero pasajero) {
        this.pasajeros.add(pasajero);
        pasajero.setAvion(this);
        return this;
    }

    public Avion removePasajero(Pasajero pasajero) {
        this.pasajeros.remove(pasajero);
        pasajero.setAvion(null);
        return this;
    }

    public void setPasajeros(Set<Pasajero> pasajeros) {
        if (this.pasajeros != null) {
            this.pasajeros.forEach(i -> i.setAvion(null));
        }
        if (pasajeros != null) {
            pasajeros.forEach(i -> i.setAvion(this));
        }
        this.pasajeros = pasajeros;
    }

    public Vuelo getVuelo() {
        return this.vuelo;
    }

    public Avion vuelo(Vuelo vuelo) {
        this.setVuelo(vuelo);
        return this;
    }

    public void setVuelo(Vuelo vuelo) {
        if (this.vuelo != null) {
            this.vuelo.setAvion(null);
        }
        if (vuelo != null) {
            vuelo.setAvion(this);
        }
        this.vuelo = vuelo;
    }

    public Modelo getModelo() {
        return this.modelo;
    }

    public Avion modelo(Modelo modelo) {
        this.setModelo(modelo);
        return this;
    }

    public void setModelo(Modelo modelo) {
        this.modelo = modelo;
    }

    public Aeropuerto getAeropuerto() {
        return this.aeropuerto;
    }

    public Avion aeropuerto(Aeropuerto aeropuerto) {
        this.setAeropuerto(aeropuerto);
        return this;
    }

    public void setAeropuerto(Aeropuerto aeropuerto) {
        this.aeropuerto = aeropuerto;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Avion)) {
            return false;
        }
        return id != null && id.equals(((Avion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Avion{" +
            "id=" + getId() +
            ", costeFabricacion=" + getCosteFabricacion() +
            ", anioFabricacion='" + getAnioFabricacion() + "'" +
            "}";
    }
}
