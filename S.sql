CREATE DATABASE music_player;
USE music_player;

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    song_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    cover_path VARCHAR(255) NOT NULL,
    timestamp VARCHAR(10) NOT NULL
);


INSERT INTO songs (song_name, file_path, cover_path, timestamp) 
VALUES 
('Senorita', 'Songs/song1.mp3', 'Covers/1.jpg', '3:51'),
('Guitar', 'Songs/song2.mp3', 'Covers/2.jpg', '3:22');


INSERT INTO songs (song_name, file_path, cover_path, timestamp) 
VALUES
('Guitar', 'Songs/song2.mp3', 'Covers/2.jpg', '3:22');
select * from songs;

delete from songs where id =9;


select * from songs;