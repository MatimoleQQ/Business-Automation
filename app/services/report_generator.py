from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf_report(file_name: str, analysis: dict, output_path: str):
    doc = SimpleDocTemplate(output_path)
    styles = getSampleStyleSheet()

    content = []

    content.append(Paragraph(f"Report for: {file_name}", styles["Title"]))
    content.append(Spacer(1, 12))

    content.append(Paragraph(f"Rows: {analysis['rows']}", styles["Normal"]))
    content.append(Paragraph(f"Columns: {analysis['columns']}", styles["Normal"]))
    content.append(Paragraph(f"Column names: {analysis['column_names']}", styles["Normal"]))
    content.append(Paragraph(f"Missing values: {analysis['missing_values']}", styles["Normal"]))

    content.append(Paragraph("INSIGHTS", styles["Heading2"]))
    content.append(Spacer(1, 10))

    insights = analysis.get("insights", [])

    if insights:
        for i in insights:
            content.append(Paragraph(f"• {i}", styles["Normal"]))
    else:
        content.append(Paragraph("No insights generated", styles["Normal"]))

    doc.build(content)

    return output_path