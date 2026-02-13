package com.silla.server.controller;

import com.silla.server.model.Booking;
import com.silla.server.repository.BookingRepository;
import com.silla.server.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    @GetMapping("/reserved")
    public List<Booking> getReservedBookings(@RequestParam String date, @RequestParam String barber) {
        return bookingRepository.findByDateAndBarber(date, barber);
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        booking.setTimestamp(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendBookingConfirmation(savedBooking);
        return savedBooking;
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingRepository.findById(id).ifPresent(booking -> {
            notificationService.sendBookingCancellation(booking);
            bookingRepository.delete(booking);
        });
    }

    // Simple Admin Auth Simulation
    @PostMapping("/auth")
    public boolean login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return "admin@silla.com".equals(email) && "admin123".equals(password);
    }
}
