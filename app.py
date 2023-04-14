from flask import Flask, current_app, render_template, url_for, request, session, flash, redirect
from datetime import datetime, date, timedelta
import urllib.request, json
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
    id = Column(Integer, primary_key=True)
    status = Column(Enum('future', 'past'), default='future')
    start = Column(DateTime, nullable=False)
    team_1 = Column(Text, nullable=False)
    team_2 = Column(Text, nullable=False)
    score_1 = Column(Integer, default=0, nullable=False)
    score_2 = Column(Integer, default=0, nullable=False)
    winner = Column(Text, nullable=True)

    def __init__(self, id, start, team_1, team_2):
        self.id = id
        self.start = start
        self.team_1 = team_1
        self.team_2 = team_2


class Comments(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    game_id = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    posted = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    def __init__(self, user_id, game_id, comment):
        self.user_id = user_id
        self.game_id = game_id
        self.comment = comment

    # def asDict(self):
    #     for comment in self.__table__.columns:
    #         comment.user_id: getattr(self, comment.user_id)
                
            

@app.route('/')
@app.route('/home')
def home():
    # Sina: had to do my fetching here, because I need to include the data in the DB as well as pass them to the 
    # view to be displayed.
    response = urllib.request.urlopen(f"https://statsapi.web.nhl.com/api/v1/schedule?startDate={getTomorrowDate()}&endDate={getNextWeekDate()}")
    data = response.read()  
    oneWeekSchedule = json.dumps(json.loads(data))
    # Sina: the data received are passed into the session variable to be used in the view for displaying.
    session['oneWeekSchedule'] = oneWeekSchedule
    data = json.loads(data)
    for date in data['dates']:
        for game in date['games']:
            # Sina: if the game is not already in the DB, insert it
            if (not Games.query.filter_by(id=game['gamePk']).first()):
                id = game['gamePk']
                start = datetime.date.fromisoformat(game['gameDate'][0:10]) 
                team_1 = game['teams']['home']['team']['name']
                team_2 = game['teams']['away']['team']['name']
                entry = Games(id, start, team_1, team_2)
                db.session.add(entry)
                db.session.commit()
    # sina: now, need to check all the games in the DB and see if they have ended. 
    # If the game has ended update their status in Games table and display the most recent
    # ones in the ended games section under them future games.
    return render_template('home.html')

@app.route('/discussions/<gameId>')
def discussions(gameId):
    if 'username' in session:
        game = Games.query.filter_by(id=gameId).first()
        temp = Comments.query.filter_by(game_id = str(game.id)).all()
        # print(str(temp[0].comment))
        
        return render_template('discussions.html', 
                               gameId=str(game.id), 
                               team1=str(game.team_1), 
                               team2=str(game.team_2), 
                               start=str(game.start)
                               )
    else:
        return render_template('home.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
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

# Functions
def getTomorrowDate():
    tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)
    return tomorrow.date()

def getNextWeekDate():
    tomorrow = datetime.datetime.now() + datetime.timedelta(days=7)
    return tomorrow.date()




# Debug Mode: On during development
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
