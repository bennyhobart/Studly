# Ensure the database exists, use it
CREATE DATABASE IF NOT EXISTS studly;
CREATE DATABASE IF NOT EXISTS studly_session;
USE studly;

# Disable foreign key checking
#SET foreign_key_checks = 0;

# Drop old tables
DROP TABLE IF EXISTS ClassSort;
DROP TABLE IF EXISTS BuildingInfo;
DROP TABLE IF EXISTS RoomInfo;
DROP TABLE IF EXISTS PostHistory;
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS TopicVotes;
DROP TABLE IF EXISTS Topic;
DROP TABLE IF EXISTS Attended;
DROP TABLE IF EXISTS UserClassTime;
DROP TABLE IF EXISTS WeeklyClassThumbs;
DROP TABLE IF EXISTS WeeklyClassRecording;
DROP TABLE IF EXISTS WeeklyClass;
DROP TABLE IF EXISTS ClassTime;
DROP TABLE IF EXISTS Class;
DROP TABLE IF EXISTS UserSubject;
DROP TABLE IF EXISTS Subject;
DROP TABLE IF EXISGS Handbook;
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
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS ClassSort (
	sort TINYINT UNSIGNED NOT NULL,
	sortName VARCHAR(32) NOT NULL,
	PRIMARY KEY(sort)
);

CREATE TABLE IF NOT EXISTS RoomInfo (
	buildingNumber SMALLINT UNSIGNED NOT NULL,
	roomNumber VARCHAR(32) NOT NULL,
	directions VARCHAR(1000),
	PRIMARY KEY(buildingNumber, roomNumber)
);

CREATE TABLE IF NOT EXISTS BuildingInfo (
	buildingNumber SMALLINT UNSIGNED NOT NULL,
	buildingName VARCHAR(200) NOT NULL,
	alternateName VARCHAR(200),
	mapReference VARCHAR(4),
	PRIMARY KEY(buildingNumber)
);

CREATE TABLE IF NOT EXISTS Semester (
	semesterID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	startDate DATE NOT NULL,
	semesterName VARCHAR(32) NOT NULL,
	PRIMARY KEY(SemesterID)
);

CREATE TABLE IF NOT EXISTS SemesterWeek (
	semesterID INT UNSIGNED NOT NULL,
	weekID TINYINT UNSIGNED NOT NULL,
	startDate DATE NOT NULL,
	PRIMARY KEY(semesterID, weekID),
	FOREIGN KEY(semesterID) REFERENCES Semester(semesterID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Handbook (
	subjectCode CHAR(9) NOT NULL,
	handbookData TEXT,
	PRIMARY KEY(subjectCode)
);

CREATE TABLE IF NOT EXISTS Subject (
	subjectID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	semesterID INT UNSIGNED NOT NULL,
	subjectName VARCHAR(255) NOT NULL,
	subjectCode CHAR(9) NOT NULL,
	echoLink CHAR(200),
	PRIMARY KEY(subjectID),
	FOREIGN KEY(semesterID) REFERENCES Semester(semesterID) ON DELETE CASCADE
);

# Index subject codes and names
CREATE INDEX subjectName ON Subject(subjectName);
CREATE INDEX subjectCode ON Subject(subjectCode);

CREATE TABLE IF NOT EXISTS UserSubject (
	userID INT UNSIGNED NOT NULL,
	subjectID INT UNSIGNED NOT NULL,
	PRIMARY KEY(userID, subjectID),
	FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE,
	FOREIGN KEY(subjectID) REFERENCES Subject(subjectID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Class (
	classID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	subjectID INT UNSIGNED NOT NULL,
	sort TINYINT UNSIGNED NOT NULL,
	duration TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(classID),
	FOREIGN KEY(subjectID) REFERENCES Subject(subjectID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ClassTime (
	classTimeID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	classID INT UNSIGNED NOT NULL,
	day TINYINT UNSIGNED NOT NULL,
	time TIME NOT NULL,
	sisBuildingName VARCHAR(128) NOT NULL,
	buildingNumber SMALLINT UNSIGNED NOT NULL,
	roomNumber VARCHAR(32) NOT NULL,
	PRIMARY KEY(ClassTimeID),
	FOREIGN KEY(ClassID) REFERENCES Class(ClassID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WeeklyClass (
	weeklyClassID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	classID INT UNSIGNED NOT NULL,
	semesterID INT UNSIGNED NOT NULL,
	weekID TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(weeklyClassID),
	FOREIGN KEY(classID) REFERENCES Class(classID) ON DELETE CASCADE,
	FOREIGN KEY(semesterID, weekID) REFERENCES SemesterWeek(semesterID, weekID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WeeklyClassRecording (
	weeklyClassID INT UNSIGNED NOT NULL,
	baseLink VARCHAR(200) NOT NULL,
	PRIMARY KEY(weeklyClassID),
	FOREIGN KEY(weeklyClassID) REFERENCES WeeklyClass(weeklyClassID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WeeklyClassThumbs (
	thumbID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	weeklyClassID INT UNSIGNED NOT NULL,
	thumbNail VARCHAR(16) NOT NULL,
	PRIMARY KEY(thumbID),
	FOREIGN KEY(weeklyClassID) REFERENCES WeeklyClass(weeklyClassID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserClassTime (
	userID INT UNSIGNED NOT NULL,
	classTimeID INT UNSIGNED NOT NULL,
	PRIMARY KEY(userID, classTimeID),
	FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE,
	FOREIGN KEY(classTimeID) REFERENCES ClassTime(classTimeID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Attended (
	userID INT UNSIGNED NOT NULL,
	weeklyClassID INT UNSIGNED NOT NULL,
	state TINYINT UNSIGNED NOT NULL,
	PRIMARY KEY(userID, weeklyClassID),
	FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE,
	FOREIGN KEY(weeklyClassID) REFERENCES WeeklyClass(weeklyClassID) ON DELETE CASCADE
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
	FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE,
	FOREIGN KEY(weeklyClassID) REFERENCES WeeklyClass(weeklyClassID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TopicVotes (
	topicID INT UNSIGNED NOT NULL,
	userID INT UNSIGNED NOT NULL,
	vote TINYINT NOT NULL,
	PRIMARY KEY(topicID, userID),
	FOREIGN KEY(topicID) REFERENCES Topic(topicID) ON DELETE CASCADE,
	FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Post (
	postID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	topicID INT UNSIGNED NOT NULL,
	userID INT UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	postTime DATETIME NOT NULL,
	editTime DATETIME,
	PRIMARY KEY(postID),
	FOREIGN KEY(topicID) REFERENCES Topic(topicID) ON DELETE CASCADE,
	FOREIGN KEY(userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PostHistory (
	postHistoryID INT UNSIGNED NOT NULL AUTO_INCREMENT,
	postID INT UNSIGNED NOT NULL,
	content TEXT NOT NULL,
	editTime DATETIME,
	PRIMARY KEY(postHistoryID),
	FOREIGN KEY(postID) REFERENCES Post(postID) ON DELETE CASCADE
);

# Create sorts
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(0, 'Lecture');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(1, 'Practical');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(2, 'Seminar');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(3, 'Tutorial');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(4, 'Workshop');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(5, 'Problem-based');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(6, 'Field Work');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(7, 'Bump-in');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(8, 'Bump-out');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(9, 'Clinical Laboratory');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(10, 'Clinical Placement');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(11, 'Clinical Practice');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(12, 'Concert Class');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(13, 'Filmmaking');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(14, 'Instrument Class');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(15, 'Independent Practice');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(16, 'Large Ensemble');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(17, 'Performance');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(18, 'Performance Class');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(19, 'Rehearsal');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(20, 'Screening');
INSERT INTO `ClassSort` (`sort`, `sortName`) VALUES(21, 'Studio');

# Enable foreign key checking again
#SET foreign_key_checks = 1;
