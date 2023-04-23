CREATE TABLE IF NOT EXISTS `recipe`(
    id INT AUTO_INCREMENT,
    private_id VARCHAR(255) NOT NULL,
    name VARCHAR(75) NOT NULL,
    author_id INT,
    author_name VARCHAR(50) NOT NULL,
    image_link VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    ingredients JSON NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(author_id) REFERENCES user(`id`)
);