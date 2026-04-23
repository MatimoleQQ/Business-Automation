from datetime import datetime

class Report:
    def __init__(self, filename, rows, columns, column_names, missing_values, pdf_path):
        self.filename = filename
        self.rows = rows
        self.columns = columns
        self.column_names = column_names
        self.missing_values = missing_values
        self.pdf_path = pdf_path
        self.created_at = datetime.now().isoformat()