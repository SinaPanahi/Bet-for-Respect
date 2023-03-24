from flask import Flask, render_template, url_for

app = Flask(__name__)

# Debug Mode: On during development
if __name__ == '__main__':
    app.run(debug=True)



@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html', title = 'About')

