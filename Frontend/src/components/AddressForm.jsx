import React, { useEffect, useState } from "react";

export default function AddressForm() {
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [colonias, setColonias] = useState([]);

  const [form, setForm] = useState({
    cp: "",
    estado: "",
    municipio: "",
    localidad: "",
    colonia: "",
    calleNumero: "",
  });

  const [cpError, setCpError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState({
    estados: false,
    municipios: false,
    localidades: false,
    colonias: false,
  });

  useEffect(() => {
    loadEstados();
  }, []);

  async function loadEstados() {
    setLoading((l) => ({ ...l, estados: true }));
    try {
      const res = await fetch("/api/estados");
      if (!res.ok) throw new Error("No se pudieron cargar los estados");
      const data = await res.json();
      setEstados(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((l) => ({ ...l, estados: false }));
    }
  }

  async function loadMunicipios(estadoClave) {
    if (!estadoClave) {
      setMunicipios([]);
      return;
    }
    setLoading((l) => ({ ...l, municipios: true }));
    try {
      const res = await fetch(
        `/api/municipios?estado=${encodeURIComponent(estadoClave)}`
      );
      if (!res.ok) throw new Error("Error al cargar municipios");
      const data = await res.json();
      setMunicipios(data);
    } catch (err) {
      console.error(err);
      setMunicipios([]);
    } finally {
      setLoading((l) => ({ ...l, municipios: false }));
    }
  }

  async function loadLocalidades(estadoClave) {
    if (!estadoClave) {
      setLocalidades([]);
      return;
    }
    setLoading((l) => ({ ...l, localidades: true }));
    try {
      const res = await fetch(
        `/api/localidades?estado=${encodeURIComponent(estadoClave)}`
      );
      if (!res.ok) throw new Error("Error al cargar localidades");
      const data = await res.json();
      setLocalidades(data);
    } catch (err) {
      console.error(err);
      setLocalidades([]);
    } finally {
      setLoading((l) => ({ ...l, localidades: false }));
    }
  }

  async function loadColonias(cp) {
    if (!cp) {
      setColonias([]);
      return;
    }
    setLoading((l) => ({ ...l, colonias: true }));
    try {
      const res = await fetch(`/api/colonias?cp=${encodeURIComponent(cp)}`);
      if (!res.ok) throw new Error("No se pudieron cargar colonias");
      const data = await res.json();
      setColonias(data);
    } catch (err) {
      console.error(err);
      setColonias([]);
    } finally {
      setLoading((l) => ({ ...l, colonias: false }));
    }
  }

  async function lookupCP(cp) {
    if (!cp) return null;
    try {
      const res = await fetch(
        `/api/codigo_postal?cp=${encodeURIComponent(cp)}`
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === "estado") {
      setForm((f) => ({
        ...f,
        municipio: "",
        localidad: "",
        colonia: "",
      }));
      setColonias([]);
      loadMunicipios(value);
      loadLocalidades(value);
      setCpError("");
    }

    if (name === "cp") {
      setForm((f) => ({ ...f, colonia: "" }));
      setColonias([]);
      setCpError("");
      setSuccess("");
    }
  }

  async function handleCpBlur() {
    const cp = form.cp && form.cp.trim();
    if (!cp) return;
    const record = await lookupCP(cp);
    if (!record) {
      setCpError("Código postal no encontrado");
      setColonias([]);
      return;
    }

    setCpError("");
    const estadoClave = record.estado;
    const municipioClave = record.municipio;
    const localidadClave = record.localidad;

    setForm((f) => ({ ...f, estado: estadoClave }));
    await Promise.all([
      loadMunicipios(estadoClave),
      loadLocalidades(estadoClave),
    ]);
    setForm((f) => ({
      ...f,
      municipio: municipioClave || "",
      localidad: localidadClave || "",
    }));

    await loadColonias(cp);
  }

  function validateForm() {
    const { cp, estado, municipio, localidad, colonia, calleNumero } = form;
    if (!cp || !estado || !municipio || !localidad || !colonia || !calleNumero)
      return false;
    return true;
  }

  async function onContinue(e) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    if (!validateForm()) {
      setFormError("Se requieren todos los campos para continuar!");
      return;
    }

    const estadoNombre = estados.find(
      (s) => s.clave === form.estado
    )?.nombre_estado;
    const municipioNombre = municipios.find(
      (m) => m.clave === form.municipio
    )?.descripcion;
    const localidadNombre = localidades.find(
      (l) => l.clave === form.localidad
    )?.descripcion;
    const coloniaNombre = colonias.find(
      (c) => c.clave === form.colonia
    )?.descripcion;

    const payload = {
      cp: form.cp,
      estado: estadoNombre,
      municipio: municipioNombre,
      localidad: localidadNombre,
      colonia: coloniaNombre,
      calleNumero: form.calleNumero,
    };

    try {
      const res = await fetch("/api/direccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar datos");

      const data = await res.json();

      if (data.status === "ok") {
        setSuccess(data.message);
      } else {
        setFormError(data.message);
      }
    } catch (err) {
      console.error(err);
      setFormError("No se pudo enviar la información");
    }
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 12 }}>Direccion</h2>

      <form onSubmit={onContinue}>
        <div style={{ marginBottom: 16 }}>
          <label>Codigo Postal</label>
          <br />
          <input
            id="cp"
            name="cp"
            value={form.cp}
            onChange={handleChange}
            onBlur={handleCpBlur}
            placeholder="44730"
            style={{
              marginTop: 6,
              padding: 8,
              width: 200,
              borderRadius: 4,
              border: cpError ? "1px solid #e11" : "1px solid #ccc",
            }}
          />
          {cpError && (
            <div style={{ color: "#e11", marginTop: 6 }}>{cpError}</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Estado</label>
            <br />
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 8, width: "100%" }}
            >
              <option value="">- Seleccionar estado -</option>
              {estados.map((s) => (
                <option key={s.clave} value={s.clave}>
                  {s.nombre_estado}
                </option>
              ))}
            </select>
            {loading.estados && (
              <div style={{ fontSize: 12 }}>Cargando estados...</div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label>Municipio</label>
            <br />
            <select
              name="municipio"
              value={form.municipio}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 8, width: "100%" }}
            >
              <option value="">- Seleccionar municipio -</option>
              {municipios.map((m) => (
                <option key={m.clave} value={m.clave}>
                  {m.descripcion}
                </option>
              ))}
            </select>
            {loading.municipios && (
              <div style={{ fontSize: 12 }}>Cargando municipios...</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label>Localidad</label>
            <br />
            <select
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 8, width: "100%" }}
            >
              <option value="">- Seleccionar localidad -</option>
              {localidades.map((l) => (
                <option key={l.clave} value={l.clave}>
                  {l.descripcion}
                </option>
              ))}
            </select>
            {loading.localidades && (
              <div style={{ fontSize: 12 }}>Cargando localidades...</div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label>Colonia</label>
            <br />
            <select
              name="colonia"
              value={form.colonia}
              onChange={handleChange}
              style={{ marginTop: 6, padding: 8, width: "100%" }}
            >
              <option value="">- Seleccionar colonia -</option>
              {colonias.map((c) => (
                <option key={c.clave} value={c.clave}>
                  {c.descripcion}
                </option>
              ))}
            </select>
            {loading.colonias && (
              <div style={{ fontSize: 12 }}>Cargando colonias...</div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Calle y numero</label>
          <br />
          <input
            id="calleNumero"
            name="calleNumero"
            value={form.calleNumero}
            onChange={handleChange}
            placeholder="Gigantes 207"
            style={{
              marginTop: 6,
              padding: 8,
              width: 335,
              borderRadius: 4,
            }}
          />
        </div>

        {formError && (
          <div style={{ color: "#e11", marginBottom: 12 }}>{formError}</div>
        )}
        {success && (
          <div style={{ color: "#0a0", marginBottom: 12 }}>{success}</div>
        )}

        <div>
          <button
            type="submit"
            style={{
              padding: "8px 14px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 4,
            }}
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
