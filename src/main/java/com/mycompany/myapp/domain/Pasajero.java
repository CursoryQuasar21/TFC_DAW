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
 * A Pasajero.
 */
@Entity
@Table(name = "pasajero")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pasajero implements Serializable {

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

    @NotNull
    @Max(value = 9)
    @Column(name = "cantidad_equipaje", nullable = false)
    private Integer cantidadEquipaje;

    @Min(value = 10)
    @Max(value = 853)
    @Column(name = "numero_asiento")
    private Integer numeroAsiento;

    @OneToMany(mappedBy = "pasajero")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pasajero" }, allowSetters = true)
    private Set<Equipaje> equipajes = new HashSet<>();

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

    public Pasajero id(Long id) {
        this.id = id;
        return this;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Pasajero nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return this.apellidos;
    }

    public Pasajero apellidos(String apellidos) {
        this.apellidos = apellidos;
        return this;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getPasaporte() {
        return this.pasaporte;
    }

    public Pasajero pasaporte(String pasaporte) {
        this.pasaporte = pasaporte;
        return this;
    }

    public void setPasaporte(String pasaporte) {
        this.pasaporte = pasaporte;
    }

    public Integer getCantidadEquipaje() {
        return this.cantidadEquipaje;
    }

    public Pasajero cantidadEquipaje(Integer cantidadEquipaje) {
        this.cantidadEquipaje = cantidadEquipaje;
        return this;
    }

    public void setCantidadEquipaje(Integer cantidadEquipaje) {
        this.cantidadEquipaje = cantidadEquipaje;
    }

    public Integer getNumeroAsiento() {
        return this.numeroAsiento;
    }

    public Pasajero numeroAsiento(Integer numeroAsiento) {
        this.numeroAsiento = numeroAsiento;
        return this;
    }

    public void setNumeroAsiento(Integer numeroAsiento) {
        this.numeroAsiento = numeroAsiento;
    }

    public Set<Equipaje> getEquipajes() {
        return this.equipajes;
    }

    public Pasajero equipajes(Set<Equipaje> equipajes) {
        this.setEquipajes(equipajes);
        return this;
    }

    public Pasajero addEquipaje(Equipaje equipaje) {
        this.equipajes.add(equipaje);
        equipaje.setPasajero(this);
        return this;
    }

    public Pasajero removeEquipaje(Equipaje equipaje) {
        this.equipajes.remove(equipaje);
        equipaje.setPasajero(null);
        return this;
    }

    public void setEquipajes(Set<Equipaje> equipajes) {
        if (this.equipajes != null) {
            this.equipajes.forEach(i -> i.setPasajero(null));
        }
        if (equipajes != null) {
            equipajes.forEach(i -> i.setPasajero(this));
        }
        this.equipajes = equipajes;
    }

    public Avion getAvion() {
        return this.avion;
    }

    public Pasajero avion(Avion avion) {
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
        if (!(o instanceof Pasajero)) {
            return false;
        }
        return id != null && id.equals(((Pasajero) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pasajero{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellidos='" + getApellidos() + "'" +
            ", pasaporte='" + getPasaporte() + "'" +
            ", cantidadEquipaje=" + getCantidadEquipaje() +
            ", numeroAsiento=" + getNumeroAsiento() +
            "}";
    }
}
