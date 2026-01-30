# NanoAgent-CLI

### A minimalist CLI agent in < 100 lines of code

With fewer than 100 lines of Python, this project turns an LLM into a CLI-based AI agent.

This project implements a simple AI agent from scratch, without using any existing agent frameworks. The goal is to demonstrate the core ideas behind agent behavior in the simplest possible form.

The core idea is straightforward: make everything as simple as possible, but still functional.

The agent is tested using the open-source model MiniMax M2, it accepts all models with OpenAI API, and it can autonomously:
- Write web pages
- Create terminal-based games
- Execute shell commands
- Manipulate files
- And more

The results are in /examples.

## Background

This project is inspired by:

- ReAct (Reason + Act) model
- Early autonomous agent experiments
- The idea that **tool use does not require complex protocols**
- The idea that as foundation models improve, **explicit agent frameworks become less necessary**, this project explores that boundary. 

This project combines prompt engineering and code. It uses carefully designed prompts, followed by checks, to constrain and guide the model's behavior.

## Features
- Minimal ReAct-style agent loop
- No agent framework needed
- No function calling / tool calling protocol needed
- Uses plain bash execution as the only tool
- Human-in-the-loop execution confirmation
- Compatible with OpenAI-compatible APIs (local or remote)
- Works on Linux / macOS / WSL on Windows

## Core Ideas
- Minimalism first: fewer abstractions, more clarity
- Transparent behavior: you see every command before execution
- Model-agnostic: works with any OpenAI-compatible model
- Concept demonstration, not system hardening
- This agent is implemented in a **ReAct**-like loop:
    - Model reasons about the task
    - Model proposes a bash command
    - User approves or rejects execution
    - System feeds execution result back to the model
    - Loop continues until <TASK_DONE> is emitted

## Getting Started

### Requirements
- Python 3.8+
- Linux / macOS (Windows users should use WSL or a virtual machine)
- Bash shell
- Python Dependencies

```python
pip install openai python-dotenv
```

Or use the provided setup script and virtual environment:
```bash
bash setup.sh
source venv/bin/activate
```

### Configuration
Create a .env file in the project root:

```
BASE_URL=""
API_KEY=""
MODEL=""
```
#### Examples
Using remote model like OpenAI
```
BASE_URL="https://api.openai.com/v1"
API_KEY="sk-xxxx"
MODEL="gpt-4o-mini"
```

Using local models (e.g. Ollama)
```
BASE_URL="http://localhost:11434/v1"
API_KEY="ollama"
MODEL="qwen2.5:7b"
```
### Run the Agent

```bash
python nanoAgent-CLI.py
```

You will see an interactive CLI like:
```
[Agent]: How can I help you?
[User]:
```
Now you can ask agent to do things. 

When the model proposes a command, you must manually approve it:
```
[Execute task] -> (ls -la ...) y/n?
```

### How It Works
The model outputs bash commands inside fenced blocks:
```bash
ls -la

- Commands are extracted via regex
- Only **one bash block is allowed per response**
- Execution results are fed back to the model as system feedback
- The task ends when the model outputs:
<TASK_DONE>
```


---

## Why NanoAgent?

Because sometimes:

- You don’t need LangChain
- You don’t need function calling
- You don’t need 10 layers of abstraction
- You don't need black box tools

You just need:
**A main loop, a sub loop, a model, and a shell.**

---

## Limitations

- No sandboxing
- No permission system
- No tool schema validation
- Performance heavily depends on the base model’s reasoning ability
- Different models may behave **very differently**

## Security Notice

**Caution**
Allowing an LLM to generate and execute bash commands is **inherently risky**.

- Always review commands before execution
- Never run this agent with elevated privileges
- Do not expose it to untrusted users
- Do not use it on production systems

This project is for **educational and experimental purposes**.

---

## License

This project is under MIT License.