import random
import time

def get_player_choice():
    """Get and validate player choice"""
    while True:
        choice = input("\nChoose your move (rock/paper/scissors) or 'q' to quit: ").lower().strip()
        if choice in ['rock', 'paper', 'scissors', 'q', 'quit']:
            return choice
        else:
            print("Invalid choice! Please enter rock, paper, scissors, or q to quit.")

def get_computer_choice():
    """Generate computer's random choice"""
    choices = ['rock', 'paper', 'scissors']
    return random.choice(choices)

def determine_winner(player, computer):
    """Determine the winner of the round"""
    if player == computer:
        return "tie"
    
    winning_combinations = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    }
    
    if winning_combinations[player] == computer:
        return "player"
    else:
        return "computer"

def display_choice(choice, player_type="Computer"):
    """Display the choice with some flair"""
    icons = {
        'rock': '🪨',
        'paper': '📄',
        'scissors': '✂️'
    }
    print(f"{player_type} chose: {choice.title()} {icons.get(choice, '')}")

def play_round():
    """Play a single round"""
    player_choice = get_player_choice()
    
    if player_choice in ['q', 'quit']:
        return False
    
    print("\n" + "="*50)
    print("Rock...")
    time.sleep(0.5)
    print("Paper...")
    time.sleep(0.5)
    print("Scissors...")
    time.sleep(0.5)
    
    computer_choice = get_computer_choice()
    
    display_choice(player_choice, "You")
    display_choice(computer_choice, "Computer")
    
    winner = determine_winner(player_choice, computer_choice)
    
    if winner == "tie":
        print("\n🤝 It's a tie!")
    elif winner == "player":
        print("\n🎉 You win this round!")
    else:
        print("\n💻 Computer wins this round!")
    
    return True

def main():
    """Main game function"""
    print("="*50)
    print("🎮 ROCK PAPER SCISSORS GAME 🎮")
    print("="*50)
    print("Game Rules:")
    print("• Rock beats Scissors")
    print("• Paper beats Rock") 
    print("• Scissors beats Paper")
    print("="*50)
    
    player_score = 0
    computer_score = 0
    ties = 0
    rounds_played = 0
    
    while True:
        if not play_round():
            break
        
        # Get current round result for score update
        # This is a simple version - could be enhanced to track scores per round
        rounds_played += 1
        
        # Simple score tracking (random for demo - in real game you'd track properly)
        # For now, just ask if player wants to continue
        continue_game = input("\nPlay another round? (y/n): ").lower().strip()
        if continue_game not in ['y', 'yes']:
            break
    
    # Final stats
    print("\n" + "="*50)
    print("🎮 GAME OVER 🎮")
    print("="*50)
    print(f"Rounds played: {rounds_played}")
    print("Thanks for playing!")
    print("="*50)

if __name__ == "__main__":
    main()
