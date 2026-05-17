from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import os


def generate_pdf_report(csv_path, analysis, pdf_path):
    print("ANALYSIS BEFORE SAVE:", analysis)
    doc = SimpleDocTemplate(pdf_path)
    styles = getSampleStyleSheet()

    content = []

    # HEADER
    content.append(Paragraph("BUSINESS REPORT", styles["Title"]))
    content.append(Paragraph(f"File: {os.path.basename(csv_path)}", styles["Normal"]))
    content.append(Spacer(1, 12))

    # SUMMARY
    content.append(Paragraph("EXECUTIVE SUMMARY", styles["Heading2"]))
    content.append(Paragraph(
        "This report provides automated analysis of uploaded dataset.",
        styles["Normal"]
    ))
    content.append(Spacer(1, 12))

    # METRICS
    print(analysis.get("rows"))
    content.append(Paragraph("BUSINESS METRICS", styles["Heading2"]))
    content.append(Paragraph(f"Rows: {analysis.get('rows', 0)}", styles["Normal"]))
    content.append(Paragraph(f"Columns: {analysis.get('columns', 0)}", styles["Normal"]))
    content.append(Spacer(1, 12))

    # DATA QUALITY
    content.append(Paragraph("DATA QUALITY", styles["Heading2"]))
    content.append(Paragraph(str(analysis.get("missing_values", {})), styles["Normal"]))
    content.append(Spacer(1, 12))

    # INSIGHTS
    content.append(Paragraph("INSIGHTS", styles["Heading2"]))
    for i in analysis.get("insights", []):
        content.append(Paragraph(f"• {i}", styles["Normal"]))

    doc.build(content)