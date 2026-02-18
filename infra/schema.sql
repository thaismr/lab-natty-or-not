-- Schema for medical clinic demo

CREATE TABLE Services (
    ServiceId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    DurationMinutes INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Patients (
    PatientId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Appointments (
    AppointmentId INT IDENTITY(1,1) PRIMARY KEY,
    PatientId INT NOT NULL FOREIGN KEY REFERENCES Patients(PatientId),
    ServiceId INT NOT NULL FOREIGN KEY REFERENCES Services(ServiceId),
    ScheduledAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
