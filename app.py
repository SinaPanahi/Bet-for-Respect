from flask import Flask, current_app, render_template, url_for, request, session, flash, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Enum, Text, DateTime, Column
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

app = Flask(__name__)
app.secret_key = 'javascript_rules'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
app.app_context().push()


class Users(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    credits = Column(Integer, default=100, nullable=False)
    bets = Column(Integer, default=0, nullable=False)
    active_bets = Column(Integer, nullable=True)
    wins = Column(Integer, default=0, nullable=False)
    losses = Column(Integer, default=0, nullable=False)
    since = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password


class Games(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    status = Column(Enum('future', 'now', 'past'))
    description = Column(Text, nullable=False, default='desc')
    start = Column(DateTime, nullable=False)
    end = Column(DateTime, nullable=False)
    team_1 = Column(Text, nullable=False)
    team_2 = Column(Text, nullable=False)
    score_1 = Column(Integer, default=0, nullable=False)
    score_2 = Column(Integer, default=0, nullable=False)
    winner = Column(Text, nullable=True)

    def __init__(self, status, description, start, end, team_1, team_2, score_1, score_2, winner):
        self.status = status,
        self.description = description,
        self.start = start,
        self.end = end,
        self.team_1 = team_1,
        self.team_2 = team_2,
        self.score_1 = score_1,
        self.score_2 = score_2,
        self.winner = winner


class Comments(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    game_id = Column(Integer, nullable=False)
    posted = Column(DateTime, nullable=False)

    def __init__(self, user_id, game_id, posted):
        self.user_id = user_id,
        self.game_id = game_id,
        self.posted = posted


@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    print(request.method)
    if request.method == 'GET':
        return render_template('register.html')
    elif request.method == 'POST':
        username = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])
        user = Users(username, email, password)
        db.session.add(user)
        db.session.commit()
        session['username'] = user.username
        session['email'] = user.email
        return redirect(url_for('login'))
        # return render_template('login.html')


@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'GET' and not 'username' in session:
        return render_template('login.html')
    elif request.method == 'GET' and 'username' in session:
        return redirect(url_for('home'))
    elif request.method == 'POST' and not 'username' in session:
        email = request.form['email']
        password = request.form['password']
        user = Users.query.filter_by(email=email).first()
        if (check_password_hash(user.password, password)):
            session['username'] = user.username
            session['email'] = user.email
            print('s    ')
            return render_template('home.html')
        else:
            return redirect(url_for('login'))


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('email', None)
    return redirect(url_for('home'))


@app.route('/users/<username>')
def users(username):
    if 'email' in session:
        username = session['username']
        return render_template('users.html', username=username.lower())
    else:
        return render_template('home.html')


@app.route('/about')
def about():
    return render_template('about.html')


# Debug Mode: On during development
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
