# Recruito — Online Job Portal

Recruito is a full-stack job portal. The React frontend lets users register and sign in as job seekers or employers, browse jobs, and submit applications. Employers can post and manage job listings. The Spring Boot backend provides the REST API, authentication, and PostgreSQL persistence.

## Project structure

```text
Backend/   Spring Boot REST API (Java, Maven, PostgreSQL)
Frontend/  React application built with Vite
```

## Requirements

- Java 25 (the backend's `pom.xml` sets `java.version` to 25)
- Maven 3.6.3 or newer, if Maven is not available through an included Maven wrapper
- Node.js 20.19+ or 22.12+, and npm
- PostgreSQL, running locally

Check installed versions:

```bash
java -version
mvn -version
node --version
npm --version
psql --version
```

## 1. Configure PostgreSQL

Create a database named `recruito` and a PostgreSQL user for the application. For example, from `psql` as a database administrator:

```sql
CREATE USER recruito_user WITH PASSWORD 'choose-a-local-password';
CREATE DATABASE recruito OWNER recruito_user;
```

Configure the backend connection in `Backend/src/main/resources/application.properties`. Set `spring.datasource.username` and `spring.datasource.password` to the local database user and password you created. The default URL expects PostgreSQL at `localhost:5432` and database `recruito`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/recruito
spring.datasource.username=recruito_user
spring.datasource.password=choose-a-local-password
```

Set `recruito.jwt.secret` to a private random string of at least 32 characters for local use. Do not commit real database passwords or production signing secrets. Hibernate is configured with `ddl-auto=update`, so it creates/updates tables when the backend starts.

## 2. Start the backend

In a terminal, from the project root:

```bash
cd Backend
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Keep this terminal running. The backend expects the local PostgreSQL service to be running and configured as above.

## 3. Start the frontend

Open a second terminal from the project root:

```bash
cd Frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The frontend currently sends API requests to `http://localhost:8080/api`, so run the backend on that port while using the app.

## Using the app

Register an account and choose a role. Job seekers can browse listings and submit applications. Employers can create listings and manage their own jobs. Application submissions may include a resume; uploaded files are stored by the backend under `uploads/resumes` relative to its working directory.

## Useful commands

Frontend, from `Frontend/`:

```bash
npm run dev      # Start the local development server
npm run build    # Create a production build in dist/
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

Backend, from `Backend/`:

```bash
mvn spring-boot:run  # Run the API
mvn clean package    # Compile and package the application
```

## Troubleshooting

- **Database connection error:** Confirm PostgreSQL is running, the `recruito` database exists, and the username/password in `application.properties` are correct.
- **Frontend cannot reach the API:** Confirm the backend is running on port 8080. The backend CORS configuration allows the Vite origin `http://localhost:5173`.
- **Java version error:** Ensure `java -version` reports Java 25 and Maven is using that same JDK.
- **Port already in use:** Stop the process using port 8080 or 5173 before starting the corresponding app.
