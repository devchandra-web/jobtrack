import os
import sys
import re
import html
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            # Suppress headers/footers on Cover Page
            return
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header
        self.drawString(36, 11 * inch - 30, "JobTrack - Technical & Architecture Documentation")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 11 * inch - 34, 8.5 * inch - 36, 11 * inch - 34)
        
        # Footer
        self.line(36, 45, 8.5 * inch - 36, 45)
        self.drawString(36, 30, "Author: Chandra Shekhar | Version 1.0")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 36, 30, page_text)
        self.restoreState()

def format_text(text):
    # Escape XML special chars first (without touching existing tags if any)
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    # Convert bold **text** to <b>text</b>
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    # Convert backticks `text` to font tag
    text = re.sub(r'`(.*?)`', r'<font name="Courier" color="#1E293B"><b>\1</b></font>', text)
    return text

def build_pdf(pdf_path, md_path):
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=48,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    NAVY = colors.HexColor("#1E293B")
    BLUE = colors.HexColor("#2563EB")
    SLATE = colors.HexColor("#475569")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=NAVY,
        alignment=1,
        spaceAfter=15
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=17,
        textColor=BLUE,
        alignment=1,
        spaceAfter=25
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=NAVY
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=SLATE
    )

    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=NAVY,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=BLUE,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=body_style,
        leftIndent=15,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CustomCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A"),
        backColor=LIGHT_BG,
        borderColor=BORDER_COLOR,
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8
    )

    th_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    td_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # COVER PAGE
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("JobTrack", title_style))
    story.append(Paragraph("Job Application & Recruitment Management System", title_style))
    story.append(HRFlowable(width="60%", thickness=3, color=BLUE, spaceAfter=20))
    story.append(Paragraph("Complete Technical Architecture & Development Documentation", subtitle_style))
    story.append(Spacer(1, 0.8 * inch))

    cover_table_data = [
        [Paragraph("Project Name:", meta_label), Paragraph("JobTrack System", meta_val)],
        [Paragraph("Application Type:", meta_label), Paragraph("Java Full Stack Enterprise Web Application", meta_val)],
        [Paragraph("Technology Stack:", meta_label), Paragraph("React 18 + Spring Boot 3 (Java 21) + MySQL", meta_val)],
        [Paragraph("Author / Engineer:", meta_label), Paragraph("Chandra Shekhar", meta_val)],
        [Paragraph("Document Version:", meta_label), Paragraph("1.0", meta_val)],
        [Paragraph("Date:", meta_label), Paragraph("September 20, 2026", meta_val)],
        [Paragraph("Live Frontend:", meta_label), Paragraph("https://jobtrack-frontend-inky.vercel.app", meta_val)],
        [Paragraph("Live Backend API:", meta_label), Paragraph("https://jobtrack-backend-xuvm.onrender.com/", meta_val)],
        [Paragraph("GitHub Repository:", meta_label), Paragraph("https://github.com/devchandra-web/jobtrack", meta_val)]
    ]
    t_cover = Table(cover_table_data, colWidths=[1.8 * inch, 4.5 * inch])
    t_cover.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_cover)
    story.append(PageBreak())

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    in_code_block = False
    code_lines = []
    in_table = False
    table_rows = []

    for line in lines:
        line_str = line.rstrip("\n")

        # Code block handling
        if line_str.startswith("```"):
            if in_code_block:
                in_code_block = False
                code_text = html.escape("\n".join(code_lines))
                formatted_code = code_text.replace("\n", "<br/>").replace(" ", "&nbsp;")
                story.append(Paragraph(formatted_code, code_style))
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(line_str)
            continue

        # Markdown Table handling
        if "|" in line_str and not line_str.startswith("#"):
            parts = [p.strip() for p in line_str.split("|")[1:-1]]
            if len(parts) > 0 and not all(c == '-' or c == '' for c in parts[0]):
                if not in_table:
                    in_table = True
                    table_rows = []
                table_rows.append(parts)
                continue
        else:
            if in_table:
                in_table = False
                if len(table_rows) > 0:
                    t_data = []
                    for i, r in enumerate(table_rows):
                        row_cells = []
                        for c_text in r:
                            st = th_style if i == 0 else td_style
                            row_cells.append(Paragraph(format_text(c_text), st))
                        t_data.append(row_cells)
                    
                    num_cols = len(table_rows[0])
                    avail_w = 7.5 * inch
                    col_w = [avail_w / num_cols] * num_cols
                    t_rendered = Table(t_data, colWidths=col_w)
                    t_rendered.setStyle(TableStyle([
                        ('BACKGROUND', (0,0), (-1,0), NAVY),
                        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                        ('VALIGN', (0,0), (-1,-1), 'TOP'),
                        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
                        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
                        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
                        ('PADDING', (0,0), (-1,-1), 5),
                    ]))
                    story.append(Spacer(1, 4))
                    story.append(t_rendered)
                    story.append(Spacer(1, 6))
                table_rows = []

        if not line_str.strip():
            continue

        # Headers & Paragraphs
        if line_str.startswith("# "):
            continue
        elif line_str.startswith("## "):
            h_text = line_str[3:].strip()
            story.append(Paragraph(format_text(h_text), h1_style))
            story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=8))
        elif line_str.startswith("### "):
            h_text = line_str[4:].strip()
            story.append(Paragraph(format_text(h_text), h2_style))
        elif line_str.startswith("- ") or line_str.startswith("* "):
            b_text = line_str[2:].strip()
            b_formatted = f"• {format_text(b_text)}"
            story.append(Paragraph(b_formatted, bullet_style))
        elif re.match(r'^\d+\.', line_str):
            story.append(Paragraph(format_text(line_str), bullet_style))
        else:
            story.append(Paragraph(format_text(line_str), body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF documentation at: {pdf_path}")

if __name__ == "__main__":
    pdf_out = "/Users/chandrashekhar/Desktop/Job Tracker/jobtrack/JobTrack-Technical-Documentation.pdf"
    md_in = "/Users/chandrashekhar/Desktop/Job Tracker/jobtrack/JobTrack-Technical-Documentation.md"
    build_pdf(pdf_out, md_in)
