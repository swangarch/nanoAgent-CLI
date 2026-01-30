import os
import time
import random
import termios
import tty
import select
import sys

class SnakeGame:
    def __init__(self):
        self.width = 10
        self.height = 10
        self.snake = [(5, 5)]
        self.direction = (1, 0)
        self.food = self.generate_food()
        self.score = 0
        self.game_over = False
        
    def generate_food(self):
        while True:
            food = (random.randint(1, self.width-2), random.randint(1, self.height-2))
            if food not in self.snake:
                return food
    
    def get_key(self):
        if select.select([sys.stdin], [], [], 0.1) == ([sys.stdin], [], []):
            return sys.stdin.read(1)
        return None
    
    def update_direction(self):
        key = self.get_key()
        if key:
            if key == 'w' and self.direction != (0, 1):
                self.direction = (0, -1)
            elif key == 's' and self.direction != (0, -1):
                self.direction = (0, 1)
            elif key == 'a' and self.direction != (1, 0):
                self.direction = (-1, 0)
            elif key == 'd' and self.direction != (-1, 0):
                self.direction = (1, 0)
            elif key == 'q':
                self.game_over = True
    
    def move_snake(self):
        head_x, head_y = self.snake[0]
        new_head = (head_x + self.direction[0], head_y + self.direction[1])
        
        # 检查边界碰撞
        if (new_head[0] <= 0 or new_head[0] >= self.width-1 or 
            new_head[1] <= 0 or new_head[1] >= self.height-1):
            self.game_over = True
            return
        
        # 检查自身碰撞
        if new_head in self.snake:
            self.game_over = True
            return
        
        self.snake.insert(0, new_head)
        
        # 检查是否吃到食物
        if new_head == self.food:
            self.score += 10
            self.food = self.generate_food()
        else:
            self.snake.pop()
    
    def draw(self):
        os.system('clear')
        print(f"贪吃蛇游戏 - 得分: {self.score}")
        print("使用 WASD 控制方向，Q 退出")
        print("+" + "-" * (self.width-2) + "+")
        
        for y in range(self.height):
            line = "|"
            for x in range(self.width):
                if (x, y) == self.snake[0]:
                    line += "O"  # 蛇头
                elif (x, y) in self.snake:
                    line += "o"  # 蛇身
                elif (x, y) == self.food:
                    line += "*"  # 食物
                else:
                    line += " "
            line += "|"
            print(line)
        
        print("+" + "-" * (self.width-2) + "+")
    
    def run(self):
        # 设置终端
        old_settings = termios.tcgetattr(sys.stdin)
        tty.setraw(sys.stdin.fileno())
        
        try:
            while not self.game_over:
                self.draw()
                self.update_direction()
                
                if not self.game_over:
                    self.move_snake()
                    time.sleep(0.3)
            
            self.draw()
            print(f"\n游戏结束！最终得分: {self.score}")
            print("按任意键退出...")
            sys.stdin.read(1)
            
        finally:
            termios.tcsetattr(sys.stdin, termios.TCSADRAIN, old_settings)

if __name__ == "__main__":
    game = SnakeGame()
    game.run()
