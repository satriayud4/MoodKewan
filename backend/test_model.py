import tensorflow as tf
import os

print("File di folder backend:")
print(os.listdir('.'))

print("\nCoba load model...")
try:
    model = tf.saved_model.load('kewan_emotion_model_export')
    infer = model.signatures["serving_default"]
    print("✓ Model berhasil dimuat!")
    
    # Cek input dan output
    print("\nInfo model:")
    for inp in infer.structured_input_signature[1].values():
        print(f"Input shape: {inp.shape}")
    
    for out_name, out_spec in infer.structured_outputs.items():
        print(f"Output '{out_name}' shape: {out_spec.shape}")
    
except Exception as e:
    print(f"✗ Error loading model: {e}")
    print(f"Error type: {type(e)}")