package com.example.direccion.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.*;

import org.json.JSONObject;
import com.example.direccion.util.DatabaseConnection;

@WebServlet("/api/direccion")
public class DireccionServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            JSONObject obj = new JSONObject(sb.toString());

            String cp = obj.optString("cp");
            String estado = obj.optString("estado");
            String municipio = obj.optString("municipio");
            String localidad = obj.optString("localidad");
            String colonia = obj.optString("colonia");
            String calleNumero = obj.optString("calleNumero");

            System.out.println("Datos recibidos:");
            System.out.println("CP: " + cp);
            System.out.println("Estado: " + estado);
            System.out.println("Municipio: " + municipio);
            System.out.println("Localidad: " + localidad);
            System.out.println("Colonia: " + colonia);
            System.out.println("Calle y Numero: " + calleNumero);

            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(
                         "INSERT INTO direccion (cp, estado, municipio, localidad, colonia, calle_numero) " + "VALUES (?, ?, ?, ?, ?, ?)")) {

                ps.setString(1, cp);
                ps.setString(2, estado);
                ps.setString(3, municipio);
                ps.setString(4, localidad);
                ps.setString(5, colonia);
                ps.setString(6, calleNumero);

                ps.executeUpdate();
            }

            JSONObject resJson = new JSONObject();
            resJson.put("status", "ok");
            resJson.put("message", "Datos validos y guardados correctamente");
            response.getWriter().write(resJson.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JSONObject resJson = new JSONObject();
            resJson.put("status", "error");
            resJson.put("message", e.getMessage());
            response.getWriter().write(resJson.toString());
        }
    }
}
