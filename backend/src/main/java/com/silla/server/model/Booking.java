package com.silla.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
