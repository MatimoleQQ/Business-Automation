import pandas as pd
import os


def process_file(file_path: str):
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path, engine="openpyxl")
    else:
        raise ValueError("Unsupported file type")

    analysis = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "missing_values": df.isnull().sum().to_dict(),

        "total_quantity": int(df["Quantity"].sum()) if "Quantity" in df.columns else None,
        "unique_products": int(df["Product"].nunique()) if "Product" in df.columns else None,
        "top_product": df["Product"].value_counts().idxmax() if "Product" in df.columns else None,
    }
    analysis["insights"] = generate_insights(df)
    return analysis

def generate_insights(df):
    insights = []

    if "Product" in df.columns:
        top_product = df["Product"].value_counts().idxmax()
        insights.append(f"Most frequently ordered product is {top_product}")

    if "Quantity" in df.columns:
        total_qty = df["Quantity"].sum()
        insights.append(f"Total quantity sold is {int(total_qty)}")

    if df.isnull().sum().sum() == 0:
        insights.append("Dataset is clean and contains no missing values")
    else:
        insights.append("Dataset contains missing values that may require cleaning")

    return insights