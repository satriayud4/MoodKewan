from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Konfigurasi model
MODEL_PATH = 'kewan_emotion_model_export'
IMAGE_SIZE = (224, 224)
CLASS_NAMES = ['Angry', 'Other', 'Sad', 'Happy']  # Sesuaikan dengan class Anda

# Load model saat app startup
try:
    model = tf.saved_model.load(MODEL_PATH)
    # Untuk inference, kita perlu get the concrete function
    infer = model.signatures["serving_default"]
    print("Model berhasil dimuat!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    infer = None

def preprocess_image(image_bytes):
    """Preprocess gambar untuk model"""
    try:
        # Buka gambar dari bytes dan SELALU convert ke RGB
        image = Image.open(io.BytesIO(image_bytes))
        
        # Penting: pastikan 3 channel (RGB), jangan grayscale
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize ke ukuran yang tepat (224, 224)
        image = image.resize(IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        # Convert ke numpy array dan normalize
        image_array = np.array(image, dtype=np.float32) / 255.0
        
        # Tambah batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint untuk prediksi emosi"""
    try:
        if model is None:
            return jsonify({'error': 'Model belum dimuat'}), 500
        
        if 'image' not in request.files:
            return jsonify({'error': 'Tidak ada file gambar'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'File tidak dipilih'}), 400
        
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        
        if processed_image is None:
            return jsonify({'error': 'Gagal memproses gambar'}), 400
        
        # Predict menggunakan SavedModel format
        predictions_output = infer(tf.constant(processed_image))
        predictions = predictions_output['dense_2'].numpy()
        
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        predicted_emotion = CLASS_NAMES[predicted_class_idx]
        
        emotion_scores = {
            CLASS_NAMES[i]: float(predictions[0][i]) 
            for i in range(len(CLASS_NAMES))
        }
        
        response = {
            'emotion': predicted_emotion,
            'confidence': confidence,
            'all_scores': emotion_scores,
            'success': True
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint untuk check status backend"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'supported_emotions': CLASS_NAMES
    }), 200

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'MoodKewan Backend API',
        'version': '1.0',
        'endpoints': {
            'predict': '/api/predict (POST)',
            'health': '/api/health (GET)'
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    