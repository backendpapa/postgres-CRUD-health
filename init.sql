CREATE TABLE user(
    ID SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
INSERT INTO users (username,email,password) VALUES ('liani','li@li.com','123456789')

CREATE TABLE patient(
    ID SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    dob VARCHAR(255),
    patientid VARCHAR(255) NOT NULL,
    accession VARCHAR(255) NOT NULL,
    procedure VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    image1 VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),
    image4 VARCHAR(255),
    image5 VARCHAR(255),
    studydate VARCHAR(255),
    studytime VARCHAR(255)
    );
    INSERT INTO patient(firstname,lastname,dob,patientid,accession,procedure) VALUES('Adrian','Niani','27/07/1998','4033022','339322','Child hand');