# Backend Setup Instructions

The connection error occurred because the backend server is not running. To run it, you need **Maven** installed.

## 1. Install Maven
1.  Download Maven: [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi) (Binary zip archive).
2.  Extract it to a folder (e.g., `C:\Program Files\Maven`).
3.  Add the `bin` folder to your System PATH environment variable.
4.  Open a new terminal and run:
    ```bash
    mvn -version
    ```

## 2. Run the Backend
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

## Alternative (Frontend Only)
If you prefer not to install Maven, we can revert to the previous version where bookings were saved in the browser's local storage.
