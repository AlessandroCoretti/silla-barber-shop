package com.silla.server.controller;

import com.silla.server.model.Barber;
import com.silla.server.repository.BarberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barbers")
@CrossOrigin(origins = "http://localhost:5173")
public class BarberController {

    @Autowired
    private BarberRepository barberRepository;

    @GetMapping
    public List<Barber> getAllBarbers() {
        return barberRepository.findAll();
    }

    @PostMapping
    public Barber createBarber(@RequestBody Barber barber) {
        // Simple ID generation if not provided (sluggify name)
        if (barber.getId() == null || barber.getId().isEmpty()) {
            barber.setId(barber.getName().toLowerCase().replaceAll("\\s+", "-"));
        }
        return barberRepository.save(barber);
    }

    @DeleteMapping("/{id}")
    public void deleteBarber(@PathVariable String id) {
        barberRepository.deleteById(id);
    }
}
