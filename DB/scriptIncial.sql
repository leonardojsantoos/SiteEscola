CREATE DATABASE EscolaDB;
GO

USE EscolaDB;
GO

-- ============================
-- TURMAS
-- ============================

CREATE TABLE Turmas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nome NVARCHAR(100) NOT NULL,
    Codigo NVARCHAR(10) NOT NULL UNIQUE
);

-- ============================
-- USUARIOS
-- ============================

CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(100) NOT NULL,

    Email NVARCHAR(150) NOT NULL UNIQUE,

    Senha NVARCHAR(255) NOT NULL,

    Role NVARCHAR(20) NOT NULL
        CHECK(Role IN ('professor','aluno')),

    TurmaId INT NULL,

    FOREIGN KEY (TurmaId)
        REFERENCES Turmas(Id)
);

-- ============================
-- MATERIAS
-- ============================

CREATE TABLE Materias (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    Nome NVARCHAR(100) NOT NULL,

    TurmaId INT NOT NULL,

    FOREIGN KEY (TurmaId)
        REFERENCES Turmas(Id)
);

-- ============================
-- NOTAS
-- ============================

CREATE TABLE Notas (
    Id INT IDENTITY(1,1) PRIMARY KEY,

    AlunoId INT NOT NULL,

    MateriaId INT NOT NULL,

    B1 DECIMAL(4,2) DEFAULT 0,

    B2 DECIMAL(4,2) DEFAULT 0,

    B3 DECIMAL(4,2) DEFAULT 0,

    B4 DECIMAL(4,2) DEFAULT 0,

    Faltas INT DEFAULT 0,

    FOREIGN KEY (AlunoId)
        REFERENCES Usuarios(Id),

    FOREIGN KEY (MateriaId)
        REFERENCES Materias(Id)
);