from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from random import randint
import os
from werkzeug.utils import secure_filename  # Add this import
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

app = Flask(__name__)

# Load model
model = load_model("models/brain_tumor_classifier_model.h5")

# Class labels
classes = ["Glioma", "Meningioma", "No Tumor", "Pituitary"]

# Upload folder
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["file"]
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

            # Preprocess image
            img = image.load_img(filepath, target_size=(150, 150))
            img_array = image.img_to_array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)

            # Prediction
            prediction = model.predict(img_array)
            predicted_class = classes[np.argmax(prediction)]
            confidence = float(np.max(prediction)) * 100

            # Use url_for to generate the correct static URL
            img_url = url_for('static', filename=f'uploads/{filename}')
            
            return redirect(url_for('report', 
                                prediction=predicted_class,
                                img_path=img_url,  # Use the URL here
                                confidence=confidence))

    return render_template("index.html")

@app.route("/report")
def report():
    current_date = datetime.now().strftime("%Y-%m-%d")
    random_number = randint(1, 9999)
    
    return render_template("report.html", 
                         prediction=request.args.get("prediction"),
                         img_path=request.args.get("img_path"),
                         confidence=request.args.get("confidence", 85),
                         current_date=current_date,
                         random_number=random_number)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
