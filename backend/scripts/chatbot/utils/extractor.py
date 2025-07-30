import os
import fitz
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