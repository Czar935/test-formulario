package com.example.direccion.servlet;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.*;

import org.json.JSONArray;
import org.json.JSONObject;
import com.example.direccion.util.DatabaseConnection;

@WebServlet("/api/colonias")
public class ColoniaServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json; charset=UTF-8");

        String cp = req.getParameter("cp");

        JSONArray colonias = new JSONArray();

        if (cp != null) {
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(
                    "SELECT clave, descripcion FROM colonia WHERE cp = ? ORDER BY descripcion")) {
                ps.setString(1, cp);
                ResultSet rs = ps.executeQuery();

                while (rs.next()) {
                    JSONObject obj = new JSONObject();
                    obj.put("clave", rs.getString("clave"));
                    obj.put("descripcion", rs.getString("descripcion"));
                    colonias.put(obj);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        resp.getWriter().write(colonias.toString());
    }
}
