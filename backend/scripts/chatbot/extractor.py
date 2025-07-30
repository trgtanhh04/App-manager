import os
import json
import fitz
import pandas as pd
from streamlit import image
import docx2txt
from PIL import Image
import pytesseract
import io
import openpyxl
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
load_dotenv()

from config import OPENAI_API_KEY, EMBEDDING_MODEL_NAME, LLM_MODEL_NAME

llm = ChatOpenAI(
    model_name=LLM_MODEL_NAME,
    temperature=0.2,
    openai_api_key=OPENAI_API_KEY
)

def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    if ext == '.pdf':
        try:
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
                images = page.get_images(full=True)
                for img_index, img in enumerate(image):
                    xref = img[0]
                    base_img = doc.extract_image(xref)
                    image_bytes = base_img["image"]
                    image = Image.open(io.BytesIO(image_bytes))
                    ocr_text = pytesseract.image_to_string(image, lang='eng')
                    text += '\n' + ocr_text
            doc.close()
        except Exception as e:
            print(f"PDF Extraction Error: {e}")
            return None

    elif ext in ['.docx', '.doc']:
        text = docx2txt.process(file_path)

    elif ext in ['.xlsx', '.xls']:
        df = pd.read_excel(file_path)
        text = df.to_string()

    elif ext in ['.txt', '.csv']:
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
            
    else:
        print(f"Unsupported file type: {ext}")
        return None
    return text


