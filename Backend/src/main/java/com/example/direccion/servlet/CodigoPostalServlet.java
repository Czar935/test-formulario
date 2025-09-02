package com.example.direccion.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.*;

import org.json.JSONObject;
import com.example.direccion.util.DatabaseConnection;

@WebServlet("/api/codigo_postal")
public class CodigoPostalServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");

        String cp = req.getParameter("cp");

        if (cp == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                "SELECT cp, estado, municipio, localidad FROM codigo_postal WHERE cp = ?")) {
            ps.setString(1, cp);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("cp", rs.getString("cp"));
                obj.put("estado", rs.getString("estado"));
                obj.put("municipio", rs.getString("municipio"));
                obj.put("localidad", rs.getString("localidad"));
                resp.getWriter().write(obj.toString());
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("{\"error\":\"Codigo postal no encontrado\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
