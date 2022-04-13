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
 * A Vuelo.
 */
@Entity
@Table(name = "vuelo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Vuelo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "fecha_origen", nullable = false)
    private Instant fechaOrigen;

    @NotNull
    @Column(name = "fecha_destino", nullable = false)
    private Instant fechaDestino;

    @NotNull
    @Min(value = 1)
    @Max(value = 99999999)
    @Column(name = "precio", nullable = false)
    private Integer precio;

    @JsonIgnoreProperties(value = { "pilotos", "tripulantes", "pasajeros", "vuelo", "modelo", "aeropuerto" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Avion avion;

    @ManyToMany(mappedBy = "vuelos")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "avions", "vuelos", "ciudad" }, allowSetters = true)
    private Set<Aeropuerto> aeropuertos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vuelo id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getFechaOrigen() {
        return this.fechaOrigen;
    }

    public Vuelo fechaOrigen(Instant fechaOrigen) {
        this.fechaOrigen = fechaOrigen;
        return this;
    }

    public void setFechaOrigen(Instant fechaOrigen) {
        this.fechaOrigen = fechaOrigen;
    }

    public Instant getFechaDestino() {
        return this.fechaDestino;
    }

    public Vuelo fechaDestino(Instant fechaDestino) {
        this.fechaDestino = fechaDestino;
        return this;
    }

    public void setFechaDestino(Instant fechaDestino) {
        this.fechaDestino = fechaDestino;
    }

    public Integer getPrecio() {
        return this.precio;
    }

    public Vuelo precio(Integer precio) {
        this.precio = precio;
        return this;
    }

    public void setPrecio(Integer precio) {
        this.precio = precio;
    }

    public Avion getAvion() {
        return this.avion;
    }

    public Vuelo avion(Avion avion) {
        this.setAvion(avion);
        return this;
    }

    public void setAvion(Avion avion) {
        this.avion = avion;
    }

    public Set<Aeropuerto> getAeropuertos() {
        return this.aeropuertos;
    }

    public Vuelo aeropuertos(Set<Aeropuerto> aeropuertos) {
        this.setAeropuertos(aeropuertos);
        return this;
    }

    public Vuelo addAeropuerto(Aeropuerto aeropuerto) {
        this.aeropuertos.add(aeropuerto);
        aeropuerto.getVuelos().add(this);
        return this;
    }

    public Vuelo removeAeropuerto(Aeropuerto aeropuerto) {
        this.aeropuertos.remove(aeropuerto);
        aeropuerto.getVuelos().remove(this);
        return this;
    }

    public void setAeropuertos(Set<Aeropuerto> aeropuertos) {
        if (this.aeropuertos != null) {
            this.aeropuertos.forEach(i -> i.removeVuelo(this));
        }
        if (aeropuertos != null) {
            aeropuertos.forEach(i -> i.addVuelo(this));
        }
        this.aeropuertos = aeropuertos;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vuelo)) {
            return false;
        }
        return id != null && id.equals(((Vuelo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vuelo{" +
            "id=" + getId() +
            ", fechaOrigen='" + getFechaOrigen() + "'" +
            ", fechaDestino='" + getFechaDestino() + "'" +
            ", precio=" + getPrecio() +
            "}";
    }
}
