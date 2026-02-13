package com.silla.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "barbers")
public class Barber {

    @Id
    private String id; // e.g. "lele", "riccardo" - keeping string ID for compatibility

    private String name;
    private String roleKey;
    @jakarta.persistence.Lob
    @jakarta.persistence.Column(length = 1000000) // Increase length for Base64 images
    private String img;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(length = 5000)
    private String descriptionIt;

    @jakarta.persistence.Lob
    @jakarta.persistence.Column(length = 5000)
    private String descriptionEn;

    public Barber() {
    }

    public Barber(String id, String name, String roleKey, String img, String descriptionIt, String descriptionEn) {
        this.id = id;
        this.name = name;
        this.roleKey = roleKey;
        this.img = img;
        this.descriptionIt = descriptionIt;
        this.descriptionEn = descriptionEn;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRoleKey() {
        return roleKey;
    }

    public void setRoleKey(String roleKey) {
        this.roleKey = roleKey;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getDescriptionIt() {
        return descriptionIt;
    }

    public void setDescriptionIt(String descriptionIt) {
        this.descriptionIt = descriptionIt;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }
}
