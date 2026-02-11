
package com.silla.server.repository;

import java.util.List;

import com.silla.server.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByDateAndBarber(String date, String barber);
}
