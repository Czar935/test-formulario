package com.example.direccion.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.*;

import org.json.JSONArray;
import org.json.JSONObject;
import com.example.direccion.util.DatabaseConnection;

@WebServlet("/api/localidades")
public class LocalidadServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");

        String estado = req.getParameter("estado");

        JSONArray localidades = new JSONArray();

        if (estado != null) {
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(
                    "SELECT clave, descripcion FROM localidad WHERE estado = ? ORDER BY descripcion")) {
                ps.setString(1, estado);
                ResultSet rs = ps.executeQuery();

                while (rs.next()) {
                    JSONObject obj = new JSONObject();
                    obj.put("clave", rs.getString("clave"));
                    obj.put("descripcion", rs.getString("descripcion"));
                    localidades.put(obj);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        resp.getWriter().write(localidades.toString());
    }
}
