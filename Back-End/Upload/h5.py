import os
import datetime
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.applications.inception_v3 import preprocess_input
import numpy as np
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
load_dotenv()


model = load_model('Model.h5')
def prepare_image(img_path):
    img = keras_image.load_img(img_path, target_size=(305, 305))
    x = keras_image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host=os.getenv("HOST"),
            user=os.getenv("USER"),
            password=os.getenv("PASSWORD"),
            database=os.getenv("DATABASE")
        )
        print("Connected to MySQL database!")
    except Error as e:
        print(f"Error connecting to MySQL: {e}")

    return connection

app = Flask(__name__)

upload_dir = os.path.join(os.getcwd(), '../../images/')
os.makedirs(upload_dir, exist_ok=True)
app.config['UPLOAD_FOLDER'] = upload_dir

@app.route('/artworks', methods=['POST'])
def upload_file():
    if 'user_id' not in request.form or 'title' not in request.form or 'image' not in request.files:
        return jsonify(error='Missing required fields'), 400

    file = request.files['image']
    filename = secure_filename(file.filename)
    image_url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(image_url)

    image = prepare_image(image_url) 

    prediction = model.predict(image)

    user_id = request.form['user_id']
    title = request.form['title']
    description = request.form['description']
    tags = request.form['tags']

    conn = create_connection()
    cursor = conn.cursor()

    if prediction < 0.00001:
        os.remove(image_url) 
        return jsonify(error='Artwork created by AI is not accepted', confidence=float(prediction)), 400
    else:

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        new_filename = f"image-{timestamp}.jpg"
        new_image_url = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)
        os.rename(image_url, new_image_url)

        try:
            cursor.execute("""
                INSERT INTO artworks (user_id, title, description, tags, image_url)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, title, description, tags, new_image_url))
            conn.commit()
            return jsonify(message='Artwork created by Human and uploaded successfully', confidence=float(prediction)), 201
        except Exception as e:
            print(f'Error creating artwork: {str(e)}')
            return jsonify(error='Internal Server Error'), 500
        
if __name__ == '__main__':
    app.run(debug=True)