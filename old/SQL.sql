# Ensure the database exists, use it
CREATE DATABASE IF NOT EXISTS studly;
CREATE DATABASE IF NOT EXISTS studly_session;
USE studly;

# Disable foreign key checking
#SET foreign_key_checks = 0;

# Drop old tables
DROP TABLE IF EXISTS PostHistory;
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS TopicVotes;
DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS Attended;
DROP TABLE IF EXISTS UserClassTime;
DROP TABLE IF EXISTS WeeklyClass;
DROP TABLE IF EXISTS ClassTime;
DROP TABLE IF EXISTS Class;
DROP TABLE IF EXISTS UserSubject;
DROP TABLE IF EXISTS Subject;
DROP TABLE IF EXISTS SemesterWeek;
DROP TABLE IF EXISTS Semester;
DROP TABLE IF EXISTS User;

# Create user table
CREATE TABLE IF NOT EXISTS User (
    userID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password CHAR(32) NOT NULL,
    email VARCHAR(50) NOT NULL,
    PRIMARY KEY(userID),
    UNIQUE(username)
);

CREATE TABLE IF NOT EXISTS Semester (
	semesterID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	startDate DATE NOT NULL,
	PRIMARY KEY(SemesterID)
);

CREATE TABLE IF NOT EXISTS SemesterWeek (
	semesterID INT UNSIGNED NOT NULL,
	weekID TINYINT UNSIGNED NOT NULL,
	startDate DATE NOT NULL,
	PRIMARY KEY(semesterID, weekID),
	FOREIGN KEY(semesterID) REFERENCES Semester(semesterID)
);

CREATE TABLE IF NOT EXISTS Subject (
	subjectID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	semesterID INT UNSIGNED NOT NULL,
	subjectName VARCHAR(255) NOT NULL,
	subjectCode CHAR(9) NOT NULL,
	echoLink CHAR(36),
	PRIMARY KEY(subjectID),
	FOREIGN KEY(semesterID) REFERENCES Semester(semesterID)
);

CREATE TABLE IF NOT EXISTS UserSubject (
	userID INT UNSIGNED NOT NULL,
	subjectID INT UNSIGNED NOT NULL,
	PRIMARY KEY(userID, subjectID),
	FOREIGN KEY(userID) REFERENCES User(userID),
	FOREIGN KEY(subjectID) REFERENCES Subject(subjectID)
);

CREATE TABLE IF NOT EXISTS Class (
	classID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	subjectID INT UNSIGNED NOT NULL,
	sort TINYINT UNSIGNED NOT NULL,
	duration TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(classID),
	FOREIGN KEY(subjectID) REFERENCES Subject(subjectID)
);

CREATE TABLE IF NOT EXISTS ClassTime (
	classTimeID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	classID INT UNSIGNED NOT NULL,
	day TINYINT UNSIGNED NOT NULL,
	time TIME NOT NULL,
	buildingNumber TINYINT UNSIGNED NOT NULL,
	roomNumber SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY(ClassTimeID),
	FOREIGN KEY(ClassID) REFERENCES Class(ClassID)
);

CREATE TABLE IF NOT EXISTS WeeklyClass (
	weeklyClassID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	classID INT UNSIGNED NOT NULL,
	weekNumber TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(weeklyClassID),
	FOREIGN KEY(classID) REFERENCES Class(classID)
);

CREATE TABLE IF NOT EXISTS UserClassTime (
	userID INT UNSIGNED NOT NULL,
	classTimeID INT UNSIGNED NOT NULL,
	PRIMARY KEY(userID, classTimeID),
	FOREIGN KEY(userID) REFERENCES User(userID),
	FOREIGN KEY(classTimeID) REFERENCES ClassTime(classTimeID)
);

CREATE TABLE IF NOT EXISTS Attended (
	userID INT UNSIGNED NOT NULL,
	weeklyClassID INT UNSIGNED NOT NULL,
	state TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(userID, weeklyClassID),
	FOREIGN KEY(userID) REFERENCES User(userID),
	FOREIGN KEY(weeklyClassID) REFERENCES WeeklyClass(weeklyClassID)
);

CREATE TABLE IF NOT EXISTS Topic (
	topicID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	userID INT UNSIGNED NOT NULL,
	weeklyClassID INT UNSIGNED NOT NULL,
	title VARCHAR(64),
	upVotes SMALLINT UNSIGNED DEFAULT 0,
	downVotes SMALLINT UNSIGNED DEFAULT 0,
	postTime DATETIME NOT NULL,
	PRIMARY KEY(topicID),
	FOREIGN KEY(userID) REFERENCES User(userID),
	FOREIGN KEY(weeklyClassID) REFERENCES WeeklyClass(weeklyClassID)
);

CREATE TABLE IF NOT EXISTS TopicVotes (
	topicID INT UNSIGNED NOT NULL,
	userID INT UNSIGNED NOT NULL,
	vote TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(topicID, userID),
	FOREIGN KEY(topicID) REFERENCES Topic(topicID),
	FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TABLE IF NOT EXISTS Post (
	postID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	topicID INT UNSIGNED NOT NULL,
	userID INT UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	postTime DATETIME NOT NULL,
	editTime DATETIME,
	PRIMARY KEY(postID),
	FOREIGN KEY(topicID) REFERENCES Topic(topicID),
	FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TABLE IF NOT EXISTS PostHistory (
	postHistoryID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	postID INT UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	editTime DATETIME,
	PRIMARY KEY(postHistoryID),
	FOREIGN KEY(postID) REFERENCES Post(postID)
);

# Enable foreign key checking again
#SET foreign_key_checks = 1;
