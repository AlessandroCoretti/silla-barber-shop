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
                // Update Lele
                Barber lele = barberRepository.findById("lele").orElse(new Barber("lele", "Lele",
                                "team.roles.barber",
                                "/assets/barber_placeholder.svg",
                                "", ""));
                lele.setRoleKey("team.roles.barber");
                lele.setImg("/assets/barber_placeholder.svg");
                lele.setDescriptionIt(
                                "Maestro del taglio classico e moderno. Con oltre 15 anni di esperienza, Lele guida il team con passione e precisione.");
                lele.setDescriptionEn(
                                "Master of classic and modern cuts. With over 15 years of experience, Lele leads the team with passion and precision.");
                barberRepository.save(lele);

                // Update Riccardo
                Barber riccardo = barberRepository.findById("riccardo").orElse(new Barber("riccardo", "Riccardo",
                                "team.roles.barber",
                                "/assets/barber_placeholder.svg",
                                "", ""));
                riccardo.setRoleKey("team.roles.barber");
                riccardo.setImg("/assets/barber_placeholder.svg");
                riccardo.setDescriptionIt(
                                "Specialista in sfumature e barbe scolpite. La sua attenzione ai dettagli è maniacale.");
                riccardo.setDescriptionEn(
                                "Specialist in fades and sculpted beards. His attention to detail is obsessive.");
                barberRepository.save(riccardo);

                // Update Jurgen
                Barber jurgen = barberRepository.findById("jurgen").orElse(new Barber("jurgen", "Jurgen",
                                "team.roles.barber",
                                "/assets/barber_placeholder.svg",
                                "", ""));
                jurgen.setRoleKey("team.roles.barber");
                jurgen.setImg("/assets/barber_placeholder.svg");
                jurgen.setDescriptionIt(
                                "Creativo e sempre aggiornato sulle ultime tendenze. Jurgen trasforma ogni taglio in un'opera d'arte.");
                jurgen.setDescriptionEn(
                                "Creative and always up to date with the latest trends. Jurgen transforms every cut into a work of art.");
                barberRepository.save(jurgen);

                // Update Stefano
                Barber stefano = barberRepository.findById("stefano").orElse(new Barber("stefano", "Stefano",
                                "team.roles.barber",
                                "/assets/barber_placeholder.svg",
                                "", ""));
                stefano.setRoleKey("team.roles.barber");
                stefano.setImg("/assets/barber_placeholder.svg");
                stefano.setDescriptionIt(
                                "Giovane talento con una mano ferma e un occhio per lo stile. Il futuro del barbering.");
                stefano.setDescriptionEn(
                                "Young talent with a steady hand and an eye for style. The future of barbering.");
                barberRepository.save(stefano);

                System.out.println("Initialized/Updated Barbers data successfully");
        }
}
