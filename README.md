# Silla Barber Shop

Un'applicazione web moderna e completa per la gestione di un salone da barbiere ("Silla Barber Shop"). Il progetto include un sito vetrina responsive, un sistema di prenotazione appuntamenti online e un pannello di amministrazione per la gestione dello staff e dei servizi.

A modern and comprehensive web application for managing a barber shop ("Silla Barber Shop"). The project includes a responsive showcase website, an online appointment booking system, and an admin dashboard for managing staff and services.

---

## 🇮🇹 Italiano

### Panoramica del Progetto
**Silla Barber Shop** è progettato per offrire un'esperienza utente fluida sia ai clienti che agli amministratori del negozio. I clienti possono esplorare i servizi, conoscere il team e prenotare appuntamenti in pochi click. Gli amministratori hanno accesso a un'area riservata per gestire le prenotazioni e le disponibilità del personale.

### Funzionalità Principali
*   **Prenotazione Online:** Interfaccia intuitiva per selezionare servizi, barbiere preferito, data e ora.
*   **Design Moderno:** Interfaccia utente curata e responsive, arricchita da animazioni fluide (GSAP).
*   **Multilingua:** Supporto completo per la localizzazione (i18n) per raggiungere un pubblico internazionale.
*   **Pannello di Amministrazione:** Dashboard protetta per visualizzare e gestire gli appuntamenti.
*   **Feedback Visivo:** Utilizzo estensivo di icone (Lucide React) e feedback immediato per le azioni dell'utente.

### Stack Tecnologico

#### Frontend (Root)
Il frontend è costruito con tecnologie web moderne per garantire prestazioni elevate e facilità di sviluppo.
*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animazioni:** [GSAP](https://greensock.com/gsap/)
*   **Icone:** [Lucide React](https://lucide.dev/)
*   **Internationalization:** [i18next](https://www.i18next.com/)
*   **Routing:** [React Router](https://reactrouter.com/)

#### Backend (Folder `/backend`)
Il backend fornisce un'API robusta e sicura per gestire i dati dell'applicazione.
*   **Framework:** [Spring Boot 3.2.2](https://spring.io/projects/spring-boot)
*   **Linguaggio:** Java 17
*   **Sicurezza:** Spring Security
*   **Database:** H2 Database (In-memory per sviluppo rapido), Spring Data JPA
*   **Utility:** Lombok

### Installazione e Avvio

#### Prerequisiti
Assicurati di avere installato sulla tua macchina:
*   [Node.js](https://nodejs.org/) (versione LTS raccomandata) e npm.
*   [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html).
*   [Maven](https://maven.apache.org/).

#### Setup del Frontend
1.  Apri il terminale nella cartella principale del progetto.
2.  Installa le dipendenze:
    ```bash
    npm install
    ```
3.  Avvia il server di sviluppo:
    ```bash
    npm run dev
    ```
    Il frontend sarà accessibile all'indirizzo mostrato nel terminale (solitamente `http://localhost:5173`).

#### Setup del Backend
1.  Spostati nella cartella `backend`:
    ```bash
    cd backend
    ```
2.  Avvia l'applicazione Spring Boot utilizzando Maven:
    ```bash
    mvn spring-boot:run
    ```
    Il server backend si avvierà (default port: `8080`).

---

## 🇬🇧 English

### Project Overview
**Silla Barber Shop** is designed to provide a seamless user experience for both customers and shop administrators. Customers can explore services, meet the team, and book appointments with just a few clicks. Administrators have access to a secure area to manage bookings and staff availability.

### Key Features
*   **Online Booking:** Intuitive interface to select services, preferred barber, date, and time.
*   **Modern Design:** Polished and responsive user interface, enriched with smooth animations (GSAP).
*   **Multi-language:** Full support for localization (i18n) to reach an international audience.
*   **Admin Dashboard:** Protected dashboard to view and manage appointments.
*   **Visual Feedback:** Extensive use of icons (Lucide React) and immediate feedback for user actions.

### Tech Stack

#### Frontend (Root)
The frontend is built with modern web technologies to ensure high performance and ease of development.
*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [GSAP](https://greensock.com/gsap/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Internationalization:** [i18next](https://www.i18next.com/)
*   **Routing:** [React Router](https://reactrouter.com/)

#### Backend (`/backend` Folder)
The backend provides a robust and secure API to handle application data.
*   **Framework:** [Spring Boot 3.2.2](https://spring.io/projects/spring-boot)
*   **Language:** Java 17
*   **Security:** Spring Security
*   **Database:** H2 Database (In-memory for rapid development), Spring Data JPA
*   **Utilities:** Lombok

### Installation and Setup

#### Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (LTS version recommended) and npm.
*   [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html).
*   [Maven](https://maven.apache.org/).

#### Frontend Setup
1.  Open your terminal in the root directory of the project.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at the address shown in the terminal (usually `http://localhost:5173`).

#### Backend Setup
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Start the Spring Boot application using Maven:
    ```bash
    mvn spring-boot:run
    ```
    The backend server will start (default port: `8080`).
