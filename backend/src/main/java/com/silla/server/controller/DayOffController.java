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

    @PostMapping("/range")
    public List<DayOff> createDayOffRange(@RequestBody DayOffRangeRequest request) {
        List<DayOff> newDayOffs = new java.util.ArrayList<>();
        LocalDate start = request.getStartDate();
        LocalDate end = request.getEndDate();

        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            // Check if already exists to avoid duplicates
            if (dayOffRepository.findByBarberIdAndDate(request.getBarberId(), date).isEmpty()) {
                DayOff dayOff = new DayOff(request.getBarberId(), date);
                newDayOffs.add(dayOffRepository.save(dayOff));
            }
        }
        return newDayOffs;
    }

    @GetMapping("/check")
    public List<DayOff> check(@RequestParam String barberId, @RequestParam String date) {
        return dayOffRepository.findByBarberIdAndDate(barberId, LocalDate.parse(date));
    }

    public static class DayOffRangeRequest {
        private String barberId;
        private LocalDate startDate;
        private LocalDate endDate;

        public String getBarberId() {
            return barberId;
        }

        public void setBarberId(String barberId) {
            this.barberId = barberId;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }
    }
}
