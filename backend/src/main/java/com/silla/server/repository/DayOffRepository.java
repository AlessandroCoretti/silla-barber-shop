package com.silla.server.repository;

import com.silla.server.model.DayOff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DayOffRepository extends JpaRepository<DayOff, Long> {
    List<DayOff> findByBarberId(String barberId);

    List<DayOff> findByDate(LocalDate date);

    List<DayOff> findByBarberIdAndDate(String barberId, LocalDate date);
}
