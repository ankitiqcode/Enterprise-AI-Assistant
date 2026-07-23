import fitz


def extract_pdf_text(file_path: str) -> str:
    text = ""

    doc = fitz.open(file_path)

    for page in doc:
        text += page.get_text()

    doc.close()

    return text