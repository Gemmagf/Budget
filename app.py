# app.py — Pressupost Familiar connectat a Google Sheets via Apps Script
import streamlit as st
import pandas as pd
import requests
from datetime import date, datetime

# ---------------- CONFIG ----------------
st.set_page_config(page_title="Pressupost Familiar", layout="wide")
st.title("🌅 Pressupost Familiar - Sunset Edition")

# Substitueix per la URL del teu Web App (App Script)
BASE_URL = "https://script.google.com/macros/s/AKfycbwdUAjU1ITteRN2_d_97ZvI91X_onTA6BtVJuAgDMrIQSqz9D7Sr2l45DXUSNYN39gb/exec"

# Noms de les pestanyes al Google Sheet
SHEETS = {
    "Membres": "Membres",
    "Despeses": "Despeses",
    "Estalvis": "Estalvis",
    "Objectius": "Objectius"
}

# ---------------- HELPERS ----------------
def safe_json(r):
    """Intenta parsejar la resposta com JSON i retorna (ok, value)."""
    try:
        return True, r.json()
    except Exception as e:
        return False, r.text

def get_sheet(sheet_name: str) -> pd.DataFrame:
    """Llegeix una pestanya des de l'App Script i retorna DataFrame."""
    try:
        r = requests.get(BASE_URL, params={"sheet": sheet_name}, timeout=15)
    except Exception as e:
        st.error(f"Error de connexió al App Script: {e}")
        return pd.DataFrame()
    ok, payload = safe_json(r)
    if not ok:
        st.error(f"Resposta no JSON del servidor per '{sheet_name}': {payload[:300]}")
        return pd.DataFrame()
    if isinstance(payload, dict) and payload.get("status") == "success":
        data = payload.get("data", [])
        if not data:
            return pd.DataFrame()
        # Assegurem que convertim a DataFrame amb columns d'acord amb dict keys
        df = pd.DataFrame(data)
        # Normalitzar índex i tipus si cal
        return df
    else:
        st.error(f"Resposta inesperada llegint '{sheet_name}': {payload}")
        return pd.DataFrame()

def add_record(sheet_name: str, record: dict) -> dict:
    """Envia un registre nou al App Script (POST). Retorna el JSON de resposta."""
    try:
        r = requests.post(BASE_URL, params={"sheet": sheet_name}, json=record, timeout=15)
    except Exception as e:
        return {"status": "error", "message": f"Error de connexió: {e}"}
    ok, payload = safe_json(r)
    if not ok:
        return {"status": "error", "message": f"Resposta no JSON: {payload[:300]}"}
    return payload

# ---------------- CÀRREGA INICIAL ----------------
@st.cache_data(ttl=30)
def load_all():
    out = {}
    for key, sheet in SHEETS.items():
        out[key] = get_sheet(sheet)
    return out

data = load_all()
df_members = data["Membres"]
df_expenses = data["Despeses"]
df_savings = data["Estalvis"]
df_goals = data["Objectius"]

# ---------------- SIDEBAR MENU ----------------
menu = st.sidebar.radio("Navegació", ["🏠 Dashboard", "👨‍👩‍👧 Membres", "💸 Despeses", "💰 Estalvis", "🎯 Objectius"])

# ---------------- DASHBOARD ----------------
if menu == "🏠 Dashboard":
    st.subheader("📊 Resum General")
    cols = st.columns(3)

    total_members = len(df_members) if not df_members.empty else 0
    total_savings = df_savings["Estalvis"].astype(float).sum() if (not df_savings.empty and "Estalvis" in df_savings.columns) else (df_savings["import_actual"].astype(float).sum() if (not df_savings.empty and "import_actual" in df_savings.columns) else 0)
    total_expenses = 0
    if not df_expenses.empty:
        # Acceptem columnes amb noms diferents: 'Import' o 'import'
        if "Import" in df_expenses.columns:
            total_expenses = pd.to_numeric(df_expenses["Import"], errors="coerce").fillna(0).sum()
        elif "import" in df_expenses.columns:
            total_expenses = pd.to_numeric(df_expenses["import"], errors="coerce").fillna(0).sum()
        else:
            # si no hi ha columna import, sumar totes numèriques
            total_expenses = df_expenses.select_dtypes(include='number').sum().sum()

    cols[0].metric("Membres", f"{total_members}")
    cols[1].metric("Estalvis totals", f"€{total_savings:,.2f}")
    cols[2].metric("Despeses totals", f"€{total_expenses:,.2f}")

    st.markdown("---")
    st.write("#### Membres")
    st.dataframe(df_members, use_container_width=True)
    st.write("#### Despeses (últimes 100)")
    st.dataframe(df_expenses.tail(100), use_container_width=True)
    st.write("#### Objectius")
    st.dataframe(df_goals, use_container_width=True)

# ---------------- MEMBRES ----------------
elif menu == "👨‍👩‍👧 Membres":
    st.subheader("👨‍👩‍👧 Gestió de membres")
    st.dataframe(df_members, use_container_width=True)

    st.markdown("---")
    st.subheader("Afegir membre")
    with st.form("form_add_member"):
        nom = st.text_input("Nom", value="")
        edat = st.number_input("Edat", min_value=0, max_value=120, value=30)
        salari = st.number_input("Salari anual (€)", min_value=0, value=0)
        estalvis = st.number_input("Estalvis actuals (€)", min_value=0, value=0)
        estalvi_mensual = st.number_input("Estalvi mensual (€)", min_value=0, value=0)
        objectiu = st.number_input("Objectiu (€)", min_value=0, value=0)
        anys_objectiu = st.number_input("Anys per assolir objectiu", min_value=0, value=0)
        submitted = st.form_submit_button("Afegir membre")
        if submitted:
            # Clau/columnes que esperem a la pestanya Membres
            # Adapta les claus en funció dels headers de la teva fulla
            record = {
                "Nom": nom,
                "Edat": int(edat),
                "Salari": float(salari),
                "Estalvis": float(estalvis),
                "EstalviMensual": float(estalvi_mensual),
                "Objectiu": float(objectiu),
                "AnysObjectiu": int(anys_objectiu)
            }
            resp = add_record(SHEETS["Membres"], record)
            if resp.get("status") == "success":
                st.success("Membre afegit correctament ✅")
                st.rerun()()
            else:
                st.error(f"Error afegint membre: {resp}")

# ---------------- DESPESES ----------------
elif menu == "💸 Despeses":
    st.subheader("💸 Registre de despeses")
    st.dataframe(df_expenses, use_container_width=True)

    st.markdown("---")
    st.subheader("Afegir despesa")
    with st.form("form_add_expense"):
        # Si hi ha df_members, oferim un selectbox de noms
        if not df_members.empty and "Nom" in df_members.columns:
            membre_nom = st.selectbox("Membre", options=list(df_members["Nom"].astype(str)))
        else:
            membre_nom = st.text_input("Membre (escriu nom)")
        categoria = st.selectbox("Categoria", ["Lloguer", "Menjar", "Educació", "Oci", "Altres"])
        import_despesa = st.number_input("Import (€)", min_value=0.0, value=0.0)
        data_despesa = st.date_input("Data", value=date.today())
        notes = st.text_input("Notes (opcional)")
        submitted = st.form_submit_button("Afegir despesa")
        if submitted:
            record = {
                "Membre": membre_nom,
                "Categoria": categoria,
                "Import": float(import_despesa),
                "Data": data_despesa.isoformat(),
                "Notes": notes
            }
            resp = add_record(SHEETS["Despeses"], record)
            if resp.get("status") == "success":
                st.success("Despesa registrada ✅")
                st.rerun()()
            else:
                st.error(f"Error afegint despesa: {resp}")

# ---------------- ESTALVIS ----------------
elif menu == "💰 Estalvis":
    st.subheader("💰 Estalvis i inversions")
    st.dataframe(df_savings, use_container_width=True)

    st.markdown("---")
    st.subheader("Afegir estalvi / inversió")
    with st.form("form_add_saving"):
        if not df_members.empty and "Nom" in df_members.columns:
            membre_nom = st.selectbox("Membre", options=list(df_members["Nom"].astype(str)))
        else:
            membre_nom = st.text_input("Membre (escriu nom)")
        compte = st.text_input("Compte / Font (ex: Indexa)")
        tipus = st.selectbox("Tipus", ["Estalvi", "Inversió"])
        import_actual = st.number_input("Import actual (€)", min_value=0.0, value=0.0)
        aport_mensual = st.number_input("Aport mensual (€)", min_value=0.0, value=0.0)
        rendiment = st.number_input("Rendiment anual (%)", min_value=0.0, value=4.0)
        submitted = st.form_submit_button("Afegir estalvi")
        if submitted:
            record = {
                "Membre": membre_nom,
                "Compte": compte,
                "Tipus": tipus,
                "Estalvis": float(import_actual),
                "AportMensual": float(aport_mensual),
                "Rendiment": float(rendiment)
            }
            resp = add_record(SHEETS["Estalvis"], record)
            if resp.get("status") == "success":
                st.success("Estalvi afegit ✅")
                st.rerun()()
            else:
                st.error(f"Error afegint estalvi: {resp}")

# ---------------- OBJECTIUS ----------------
elif menu == "🎯 Objectius":
    st.subheader("🎯 Objectius financers")
    st.dataframe(df_goals, use_container_width=True)

    st.markdown("---")
    st.subheader("Afegir objectiu")
    with st.form("form_add_goal"):
        if not df_members.empty and "Nom" in df_members.columns:
            membre_nom = st.selectbox("Membre", options=list(df_members["Nom"].astype(str)))
        else:
            membre_nom = st.text_input("Membre (escriu nom)")
        nom_obj = st.text_input("Nom objectiu")
        target = st.number_input("Quantitat objectiu (€)", min_value=0.0, value=0.0)
        current = st.number_input("Quantitat actual (€)", min_value=0.0, value=0.0)
        deadline = st.date_input("Data límit", value=date.today())
        submitted = st.form_submit_button("Afegir objectiu")
        if submitted:
            record = {
                "Membre": membre_nom,
                "Objectiu": nom_obj,
                "Import": float(target),
                "Actual": float(current),
                "DataLímit": deadline.isoformat()
            }
            resp = add_record(SHEETS["Objectius"], record)
            if resp.get("status") == "success":
                st.success("Objectiu afegit ✅")
                st.rerun()()
            else:
                st.error(f"Error afegint objectiu: {resp}")

# --------- nota final ----------
st.sidebar.markdown("---")
st.sidebar.caption("Pressupost Familiar — editant dades directament al Google Sheet via Apps Script")
