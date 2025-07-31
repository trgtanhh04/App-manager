import os
import sys
# Thêm backend vào Python path để tránh xung đột với frontend
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..'))

import pymupdf as fitz  # Import PyMuPDF với alias
import pandas as pd
import docx2txt
from PIL import Image
import pytesseract
import io

def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    if ext == '.pdf':
        try:
            doc = fitz.open(file_path)
            for page in doc:
                page_text = page.get_text()
                text += page_text
                images = page.get_images(full=True)
                for img_index, img in enumerate(images):
                    xref = img[0]
                    base_img = doc.extract_image(xref)
                    image_bytes = base_img["image"]
                    image = Image.open(io.BytesIO(image_bytes))
                    ocr_text = pytesseract.image_to_string(image, lang='eng+vie')
                    text += '\n[OCR]\n' + ocr_text
            doc.close()
        except Exception as e:
            print(f"PDF Extraction Error: {e}")
            return None

    elif ext in ['.docx', '.doc']:
        text = docx2txt.process(file_path)

    elif ext in ['.xlsx', '.xls']:
        df = pd.read_excel(file_path)
        text = df.to_string()

    elif ext in ['.csv']:
        df = pd.read_csv(file_path)
        text = df.to_string()

    elif ext in ['.txt']:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()

    elif ext in ['.png', '.jpg', '.jpeg']:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image, lang='eng+vie')

    else:
        print(f"Unsupported file type: {ext}")
        return None
    return text

if __name__ == "__main__":
    file_path = "E:\\App-manager\\backend\\scripts\\chatbot\\uploaded_files\\test1.docx"  
    extracted_text = extract_text(file_path)
    if extracted_text:
        print("Extracted Text:")
        print(extracted_text)
    else:
        print("Failed to extract text from the file.")
# python backend/scripts/chatbot/utils/extractor.py