package com.silla.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String barber;
    private String service;
    private String date; // YYYY-MM-DD
    private String time; // HH:mm
    
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String message;
    
    private double price;
    
    private LocalDateTime timestamp;


    public Booking() {}

    public Booking(Long id, String barber, String service, String date, String time, String name, String surname, String email, String phone, String message, double price, LocalDateTime timestamp) {
        this.id = id;
        this.barber = barber;
        this.service = service;
        this.date = date;
        this.time = time;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.message = message;
        this.price = price;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBarber() { return barber; }
    public void setBarber(String barber) { this.barber = barber; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
