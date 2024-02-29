# RoboGame

This is a simple game made with the pygame-library. It was made for Advanced Course in Programming for University of Helsinki.  Player controls a robot and collects coins while avoiding monsters.

The game is implemented with two classes. One class contains funtionality for the creatures (both monsters and coins), while the other class runs the actual game and contains functionality for controlling the player character. The main code of this game is inside [src/main.py](https://github.com/TuikkaTommi/portfolio/blob/main/Python/RoboGame/src/main.py) file. The collision between player and coins/monters is checked by checking if the entities image rectangles overlap eachother with colliderect()-method.
