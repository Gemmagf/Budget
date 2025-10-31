import streamlit as st
import pandas as pd
import requests

# ---------------- CONFIG ----------------
BASE_URL = "https://script.google.com/macros/s/AKfycbyz4BwKzk0NisjrpLmhBLu4NQMGXUuIomFXKP88pWCb5pILQRhKkhUFVINnX72O9IJQ/exec"

SHEETS = {
    "Membres": "Membres",
    "Despeses": "Despeses",
    "Objectius": "Objectius"
}

# ---------------- HELPERS ----------------
def get_sheet(sheet_name):
    try:
        r = requests.get(BASE_URL, params={"sheet": sheet_name})
        data = r.json()
        df = pd.DataFrame(data[1:], columns=data[0])
        return df
    except Exception as e:
        st.error(f"Error carregant {sheet_name}: {e}")
        return pd.DataFrame()

def add_record(sheet_name, record):
    try:
        r = requests.post(BASE_URL, params={"sheet": sheet_name}, json=record)
        return r.json()
    except Exception as e:
        st.error(f"Error enviant registre a {sheet_name}: {e}")
        return None

# ---------------- STREAMLIT APP ----------------
st.set_page_config(page_title="Pressupost Familiar", layout="wide")
st.title("🌅 Pressupost Familiar amb Google Sheets")

menu = st.sidebar.radio("Navegació", ["🏠 Dashboard", "👨‍👩‍👧 Membres", "💸 Despeses", "🎯 Objectius"])

# ---------- DASHBOARD ----------
if menu == "🏠 Dashboard":
    st.subheader("📊 Resum General")
    df_members = get_sheet(SHEETS["Membres"])
    df_expenses = get_sheet(SHEETS["Despeses"])
    df_goals = get_sheet(SHEETS["Objectius"])

    st.markdown("**Membres:**")
    st.dataframe(df_members)
    st.markdown("**Despeses:**")
    st.dataframe(df_expenses)
    st.markdown("**Objectius:**")
    st.dataframe(df_goals)

# ---------- MEMBRES ----------
elif menu == "👨‍👩‍👧 Membres":
    st.subheader("👨‍👩‍👧 Gestió de membres")
    df_members = get_sheet(SHEETS["Membres"])
    st.dataframe(df_members)

    st.markdown("---")
    st.subheader("Afegir membre")
    with st.form("add_member"):
        nom = st.text_input("Nom")
        edat = st.number_input("Edat", min_value=0, max_value=120, step=1)
        salari = st.number_input("Salari anual (€)", min_value=0.0)
        estalvis = st.number_input("Estalvis actuals (€)", min_value=0.0)
        mensuals = st.number_input("Estalvis mensuals (€)", min_value=0.0)
        objectiu = st.number_input("Objectiu (€)", min_value=0.0)
        deadline = st.date_input("Data límit")
        submitted = st.form_submit_button("Afegir membre")
        if submitted:
            record = {
                "Name": nom,
                "Age": edat,
                "Salary": salari,
                "Savings": estalvis,
                "MonthlySavings": mensuals,
                "Goal": objectiu,
                "GoalDeadline": deadline.isoformat()
            }
            resp = add_record(SHEETS["Membres"], record)
            st.write(resp)
            st.success(f"Membre {nom} afegit!")

# ---------- DESPESES ----------
elif menu == "💸 Despeses":
    st.subheader("💸 Registre de despeses")
    df_expenses = get_sheet(SHEETS["Despeses"])
    st.dataframe(df_expenses)

    st.markdown("---")
    st.subheader("Afegir despesa")
    with st.form("add_expense"):
        nom = st.text_input("Nom del membre")
        categoria = st.selectbox("Categoria", ["Lloguer", "Menjar", "Oci", "Altres"])
        import_despesa = st.number_input("Import (€)", min_value=0.0)
        tipus = st.selectbox("Tipus", ["Income", "Expense"])
        submitted = st.form_submit_button("Afegir despesa")
        if submitted:
            record = {
                "Name": nom,
                "Category": categoria,
                "Amount": import_despesa,
                "Type": tipus
            }
            resp = add_record(SHEETS["Despeses"], record)
            st.write(resp)
            st.success(f"Despesa de {nom} registrada!")

# ---------- OBJECTIUS ----------
elif menu == "🎯 Objectius":
    st.subheader("🎯 Objectius financers")
    df_goals = get_sheet(SHEETS["Objectius"])
    st.dataframe(df_goals)

    st.markdown("---")
    st.subheader("Afegir objectiu")
    with st.form("add_goal"):
        nom = st.text_input("Nom del membre")
        objectiu = st.number_input("Quantitat objectiu (€)", min_value=0.0)
        deadline = st.date_input("Data límit")
        submitted = st.form_submit_button("Afegir objectiu")
        if submitted:
            record = {
                "Name": nom,
                "Goal": objectiu,
                "GoalDeadline": deadline.isoformat()
            }
            resp = add_record(SHEETS["Objectius"], record)
            st.write(resp)
            st.success(f"Objectiu de {nom} afegit!")
