package com.silla.server.config;

import com.silla.server.model.Barber;
import com.silla.server.repository.BarberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private BarberRepository barberRepository;

        @Override
        public void run(String... args) throws Exception {
                if (barberRepository.count() == 0) {
                        barberRepository.save(new Barber("lele", "Lele", "team.roles.head_barber",
                                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                        "Maestro del taglio classico e moderno. Con oltre 15 anni di esperienza, Lele guida il team con passione e precisione."));

                        barberRepository.save(new Barber("riccardo", "Riccardo", "team.roles.stylist",
                                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
                                        "Specialista in sfumature e barbe scolpite. La sua attenzione ai dettagli è maniacale."));

                        barberRepository.save(new Barber("jurgen", "Jurgen", "team.roles.barber",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
                                        "Creativo e sempre aggiornato sulle ultime tendenze. Jurgen trasforma ogni taglio in un'opera d'arte."));

                        barberRepository.save(new Barber("stefano", "Stefano", "team.roles.junior",
                                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
                                        "Giovane talento con una mano ferma e un occhio per lo stile. Il futuro del barbering."));
                        System.out.println("Initialized Barbers data");
                }
        }
}
