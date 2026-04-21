import pandas as pd


def process_file(file_path: str):
    # wczytaj plik (Excel lub CSV)
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    # podstawowa analiza (na start)
    result = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "missing_values": df.isnull().sum().to_dict()
    }

    return result