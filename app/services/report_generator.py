from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf_report(file_name, analysis, output_path):
    doc = SimpleDocTemplate(output_path)
    styles = getSampleStyleSheet()

    content = []

    # HEADER
    content.append(Paragraph("BUSINESS REPORT", styles["Title"]))
    content.append(Paragraph(f"File: {file_name}", styles["Normal"]))
    content.append(Spacer(1, 12))

    # SUMMARY
    content.append(Paragraph("EXECUTIVE SUMMARY", styles["Heading2"]))
    content.append(Paragraph(
        "This report provides automated analysis of uploaded dataset.",
        styles["Normal"]
    ))
    content.append(Spacer(1, 12))

    # METRICS
    content.append(Paragraph("BUSINESS METRICS", styles["Heading2"]))
    content.append(Paragraph(f"Rows: {analysis['rows']}", styles["Normal"]))
    content.append(Paragraph(f"Columns: {analysis['columns']}", styles["Normal"]))
    content.append(Spacer(1, 12))

    # DATA QUALITY
    content.append(Paragraph("DATA QUALITY", styles["Heading2"]))
    content.append(Paragraph(str(analysis["missing_values"]), styles["Normal"]))
    content.append(Spacer(1, 12))

    # INSIGHTS
    content.append(Paragraph("INSIGHTS", styles["Heading2"]))
    for i in analysis.get("insights", []):
        content.append(Paragraph(f"• {i}", styles["Normal"]))

    doc.build(content)