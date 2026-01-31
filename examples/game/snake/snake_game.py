import curses
import random

def main(stdscr):
    # Initialize curses
    curses.curs_set(0)  # Hide cursor
    stdscr.timeout(150)  # Game speed (milliseconds)
    
    # Get screen dimensions
    height, width = stdscr.getmaxyx()
    
    # Game area boundaries
    game_height = height - 2
    game_width = width - 2
    
    # Initialize game state
    snake = [(game_height//2, game_width//2)]
    direction = (0, 1)  # Start moving right
    food = (random.randint(1, game_height-2), random.randint(1, game_width-2))
    score = 0
    game_over = False
    
    # Colors
    curses.start_color()
    curses.init_pair(1, curses.COLOR_GREEN, curses.COLOR_BLACK)  # Snake
    curses.init_pair(2, curses.COLOR_RED, curses.COLOR_BLACK)    # Food
    curses.init_pair(3, curses.COLOR_WHITE, curses.COLOR_BLACK)  # Border
    
    # Main game loop
    while not game_over:
        stdscr.clear()
        
        # Draw border
        for y in range(game_height):
            for x in range(game_width):
                if y == 0 or y == game_height-1 or x == 0 or x == game_width-1:
                    stdscr.attron(curses.color_pair(3))
                    stdscr.addch(y, x, '#')
                    stdscr.attroff(curses.color_pair(3))
        
        # Draw food
        stdscr.attron(curses.color_pair(2))
        stdscr.addch(food[0], food[1], '*')
        stdscr.attroff(curses.color_pair(2))
        
        # Draw snake
        stdscr.attron(curses.color_pair(1))
        for segment in snake:
            stdscr.addch(segment[0], segment[1], 'O')
        stdscr.attroff(curses.color_pair(1))
        
        # Draw score
        stdscr.addstr(0, 2, f"Score: {score}")
        stdscr.addstr(0, width-20, "Press 'q' to quit")
        
        stdscr.refresh()
        
        # Handle input
        try:
            key = stdscr.getch()
            if key == ord('q'):
                break
            elif key == curses.KEY_UP and direction != (1, 0):
                direction = (-1, 0)
            elif key == curses.KEY_DOWN and direction != (-1, 0):
                direction = (1, 0)
            elif key == curses.KEY_LEFT and direction != (0, 1):
                direction = (0, -1)
            elif key == curses.KEY_RIGHT and direction != (0, -1):
                direction = (0, 1)
        except curses.error:
            continue
        
        # Calculate new head position
        head_y, head_x = snake[0]
        new_head = (head_y + direction[0], head_x + direction[1])
        
        # Check collision with walls
        if (new_head[0] <= 0 or new_head[0] >= game_height-1 or
            new_head[1] <= 0 or new_head[1] >= game_width-1):
            game_over = True
            continue
        
        # Check collision with self
        if new_head in snake:
            game_over = True
            continue
        
        # Move snake
        snake.insert(0, new_head)
        
        # Check if food eaten
        if new_head == food:
            score += 10
            food = (random.randint(1, game_height-2), random.randint(1, game_width-2))
            # Make sure food doesn't spawn on snake
            while food in snake:
                food = (random.randint(1, game_height-2), random.randint(1, game_width-2))
        else:
            snake.pop()
    
    # Game over screen
    stdscr.clear()
    stdscr.addstr(game_height//2 - 1, game_width//2 - 10, "GAME OVER!")
    stdscr.addstr(game_height//2, game_width//2 - 10, f"Final Score: {score}")
    stdscr.addstr(game_height//2 + 1, game_width//2 - 15, "Press any key to exit")
    stdscr.refresh()
    stdscr.timeout(-1)  # Wait for key press
    stdscr.getch()

def start_game():
    curses.wrapper(main)

if __name__ == "__main__":
    start_game()
