from flask import Flask, render_template, url_for

app = Flask(__name__)

# Debug Mode: On during development
if __name__ == '__main__':
    app.run(debug=True)



@app.route('/')
@app.route('/home')
def home():
    # changed home route
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html', title = 'About')

