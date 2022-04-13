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
 * A Modelo.
 */
@Entity
@Table(name = "modelo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Modelo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 4, max = 10)
    @Column(name = "nombre", length = 10, nullable = false)
    private String nombre;

    @NotNull
    @Min(value = 1)
    @Max(value = 9)
    @Column(name = "motores", nullable = false)
    private Integer motores;

    @NotNull
    @Min(value = 1)
    @Max(value = 4)
    @Column(name = "cantidad_pilotos", nullable = false)
    private Integer cantidadPilotos;

    @NotNull
    @Min(value = 1)
    @Max(value = 9)
    @Column(name = "cantidad_tripulantes", nullable = false)
    private Integer cantidadTripulantes;

    @NotNull
    @Min(value = 1)
    @Max(value = 853)
    @Column(name = "cantidad_pasajeros", nullable = false)
    private Integer cantidadPasajeros;

    @NotNull
    @Min(value = 0)
    @Max(value = 999)
    @Column(name = "cantidad_equipajes", nullable = false)
    private Integer cantidadEquipajes;

    @OneToMany(mappedBy = "modelo")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pilotos", "tripulantes", "pasajeros", "vuelo", "modelo", "aeropuerto" }, allowSetters = true)
    private Set<Avion> avions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Modelo id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Modelo nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getMotores() {
        return this.motores;
    }

    public Modelo motores(Integer motores) {
        this.motores = motores;
        return this;
    }

    public void setMotores(Integer motores) {
        this.motores = motores;
    }

    public Integer getCantidadPilotos() {
        return this.cantidadPilotos;
    }

    public Modelo cantidadPilotos(Integer cantidadPilotos) {
        this.cantidadPilotos = cantidadPilotos;
        return this;
    }

    public void setCantidadPilotos(Integer cantidadPilotos) {
        this.cantidadPilotos = cantidadPilotos;
    }

    public Integer getCantidadTripulantes() {
        return this.cantidadTripulantes;
    }

    public Modelo cantidadTripulantes(Integer cantidadTripulantes) {
        this.cantidadTripulantes = cantidadTripulantes;
        return this;
    }

    public void setCantidadTripulantes(Integer cantidadTripulantes) {
        this.cantidadTripulantes = cantidadTripulantes;
    }

    public Integer getCantidadPasajeros() {
        return this.cantidadPasajeros;
    }

    public Modelo cantidadPasajeros(Integer cantidadPasajeros) {
        this.cantidadPasajeros = cantidadPasajeros;
        return this;
    }

    public void setCantidadPasajeros(Integer cantidadPasajeros) {
        this.cantidadPasajeros = cantidadPasajeros;
    }

    public Integer getCantidadEquipajes() {
        return this.cantidadEquipajes;
    }

    public Modelo cantidadEquipajes(Integer cantidadEquipajes) {
        this.cantidadEquipajes = cantidadEquipajes;
        return this;
    }

    public void setCantidadEquipajes(Integer cantidadEquipajes) {
        this.cantidadEquipajes = cantidadEquipajes;
    }

    public Set<Avion> getAvions() {
        return this.avions;
    }

    public Modelo avions(Set<Avion> avions) {
        this.setAvions(avions);
        return this;
    }

    public Modelo addAvion(Avion avion) {
        this.avions.add(avion);
        avion.setModelo(this);
        return this;
    }

    public Modelo removeAvion(Avion avion) {
        this.avions.remove(avion);
        avion.setModelo(null);
        return this;
    }

    public void setAvions(Set<Avion> avions) {
        if (this.avions != null) {
            this.avions.forEach(i -> i.setModelo(null));
        }
        if (avions != null) {
            avions.forEach(i -> i.setModelo(this));
        }
        this.avions = avions;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Modelo)) {
            return false;
        }
        return id != null && id.equals(((Modelo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Modelo{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", motores=" + getMotores() +
            ", cantidadPilotos=" + getCantidadPilotos() +
            ", cantidadTripulantes=" + getCantidadTripulantes() +
            ", cantidadPasajeros=" + getCantidadPasajeros() +
            ", cantidadEquipajes=" + getCantidadEquipajes() +
            "}";
    }
}
