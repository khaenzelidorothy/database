create schema children_vaccination;
create table children_vaccination.child_details(
child_id SERIAL PRIMARY KEY,
first_name VARCHAR(120) NOT NULL,
last_name VARCHAR(120) NOT NULL,
date_of_birth VARCHAR(120) NOT NULL,
birth_certificate_no VARCHAR(120) NOT NULL,
gender VARCHAR(120) CHECK(gender in('male','female')),
blood_group VARCHAR(120) NOT NULL
);

SELECT * FROM children_vaccination.child_details;
INSERT INTO children_vaccination.child_details(first_name,last_name,date_of_birth,birth_certificate_no,gender,blood_group)
values
('Jane','wamboi','2020-03-10','167839909','female','AB-'),
('Janet','wumboi','2019-07-18','765899909','female','O-'),
('Erick','wanjala','2021-10-14','467939909','male','A');

CONSTRAINT fk_child
    FOREIGN KEY(child_id)
        REFERENCES children_vaccination.child_details
        ON DELETE CASCADE


CREATE TABLE children_vaccination.parent_details(
parent_ID SERIAL PRIMARY KEY,
parent_name VARCHAR ( 25) NOT NULL,
gender VARCHAR (10) NOT NULL CHECK (Gender IN ('Female','Male')),
national_ID VARCHAR (20) NOT NULL,
parent_address VARCHAR(30) NOT NULL
)

SELECT * FROM children_vaccination.parent_detail;
INSERT INTO children_vaccination.parent_detail(parent_name,gender, national_ID, parent_address) VALUES
('Susan Makaya', 'Female', '45678630','chariots34'),
('Joyce Nyaboke', 'Female', '40456090','jamni45'),
('Brian Kiptoo', 'Male', '22601111','jammaW678')

SELECT * FROM children_vaccination.parent_detail

CONSTRAINT fk_parent
    FOREIGN KEY(parent_ID)
        REFERENCES children_vaccination.parent_detail
        ON DELETE CASCADE

CREATE TABLE children_vaccination.parent_child_relationship(
    table_id SERIAL PRIMARY KEY,
    child_id INTEGER NOT NULL,
    parent_ID INTEGER NOT NULL,
    relationship VARCHAR(30) NOT NULL


)

select * from children_vaccination.parent_child_relationship

INSERT INTO children_vaccination.parent_child_relationship(child_id,parent_id,relationship)VALUES
(1,1,'Mother'),
(2,2,'Mother'),
(3,3,'Father')

SELECT * FROM children_vaccination.parent_child_relationship;







