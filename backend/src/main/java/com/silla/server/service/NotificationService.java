package com.silla.server.service;

import com.silla.server.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired(required = false)
    private JavaMailSender emailSender;

    public void sendBookingConfirmation(Booking booking) {
        System.out.println("--------------------------------------------------");
        System.out.println("Simulating SMS to Client (+39 " + booking.getPhone() + "):");
        System.out.println("Ciao " + booking.getName() + ", confermiamo il tuo appuntamento per il " + booking.getDate() + " alle " + booking.getTime() + ".");
        System.out.println("--------------------------------------------------");

        // Email Logic
        String subject = "Conferma Prenotazione - Silla Barber Shop";
        String text = "Ciao " + booking.getName() + ",\n\n" +
                "Il tuo appuntamento è confermato!\n" +
                "Servizio: " + booking.getService() + "\n" +
                "Data: " + booking.getDate() + "\n" +
                "Ora: " + booking.getTime() + "\n" +
                "Barbiere: " + booking.getBarber() + "\n\n" +
                "A presto,\nSilla Barber Shop";

        sendEmail(booking.getEmail(), subject, text);
    }

    public void sendBookingCancellation(Booking booking) {
        System.out.println("--------------------------------------------------");
        System.out.println("Simulating SMS to Client (+39 " + booking.getPhone() + "):");
        System.out.println("Ciao " + booking.getName() + ", il tuo appuntamento del " + booking.getDate() + " è stato cancellato.");
        System.out.println("--------------------------------------------------");

        // Email Logic
        String subject = "Cancellazione Appuntamento - Silla Barber Shop";
        String text = "Ciao " + booking.getName() + ",\n\n" +
                "Ci dispiace informarti che il tuo appuntamento previsto per il " + booking.getDate() + " alle " + booking.getTime() + " è stato cancellato.\n\n" +
                "Contattaci per fissare un nuovo appuntamento.\n\n" +
                "Silla Barber Shop";

        sendEmail(booking.getEmail(), subject, text);
    }

    private void sendEmail(String to, String subject, String text) {
        if (emailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(text);
                emailSender.send(message);
                System.out.println("Email Sent Successfully to " + to);
            } catch (Exception e) {
                System.err.println("Error sending email: " + e.getMessage());
            }
        } else {
            System.out.println("--------------------------------------------------");
            System.out.println("Email Sender not configured. Simulating Email to " + to + ":");
            System.out.println("Subject: " + subject);
            System.out.println("Body: \n" + text);
            System.out.println("--------------------------------------------------");
        }
    }
}
