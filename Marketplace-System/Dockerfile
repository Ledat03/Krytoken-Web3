# Stage 1
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

#Stage 2
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar cryptobe.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","cryptobe.jar"]

