package com.silla.server.controller;

import com.silla.server.model.DayOff;
import com.silla.server.repository.DayOffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dayoffs")
@CrossOrigin(origins = "http://localhost:5173")
public class DayOffController {

    @Autowired
    private DayOffRepository dayOffRepository;

    @GetMapping
    public List<DayOff> getAllDayOffs() {
        return dayOffRepository.findAll();
    }

    @PostMapping
    public DayOff createDayOff(@RequestBody DayOff dayOff) {
        return dayOffRepository.save(dayOff);
    }

    @DeleteMapping("/{id}")
    public void deleteDayOff(@PathVariable Long id) {
        dayOffRepository.deleteById(id);
    }

    @GetMapping("/check")
    public List<DayOff> check(@RequestParam String barberId, @RequestParam String date) {
        return dayOffRepository.findByBarberIdAndDate(barberId, LocalDate.parse(date));
    }
}
