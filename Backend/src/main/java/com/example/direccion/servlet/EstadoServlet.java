package com.example.direccion.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.*;

import org.json.JSONArray;
import org.json.JSONObject;
import com.example.direccion.util.DatabaseConnection;

@WebServlet("/api/estados")
public class EstadoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");

        JSONArray estados = new JSONArray();

        try (Connection conn = DatabaseConnection.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT clave, nombre_estado FROM estado ORDER BY nombre_estado")) {

            while (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("clave", rs.getString("clave"));
                obj.put("nombre_estado", rs.getString("nombre_estado"));
                estados.put(obj);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        resp.getWriter().write(estados.toString());
    }
}
