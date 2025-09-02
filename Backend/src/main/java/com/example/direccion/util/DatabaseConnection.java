package com.example.direccion.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {

    private static final String DB_URL = "jdbc:postgresql://localhost:5432/catalogos";
    private static final String DB_USER = "postgres";
    private static final String DB_PASSWORD = "Sql.p0st.935";

    public static Connection getConnection() throws Exception {
        Class.forName("org.postgresql.Driver");
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }
}
