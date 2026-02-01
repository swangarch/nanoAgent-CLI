#!/usr/bin/python3

from openai import OpenAI
from dotenv import load_dotenv
import subprocess
import re
import os
from typing import List, Dict, Tuple
from subprocess import CompletedProcess
from pathlib import Path

load_dotenv()
API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
MODEL = os.getenv("MODEL")
SYS_PROMPT = Path("sys_prompt.txt").read_text(encoding="utf-8")
INFO_CANCEL = "\033[1;31m[Info]: User has cancelled the operation.\033[0m"
INFO_BREAK = "\033[1;31m[Info]: User has break the operation with Ctrl+C, ask user what to do next.\033[0m"
ERR_MUL = "\033[1;31m[Err]: more than one bash block is generated in one conversation.\033[0m"
HEADER = Path("header.txt").read_text(encoding="utf-8")

def parse_response(content: str) -> Tuple[List[str], str]:
    cmds = re.findall(r"```bash\n(.*?)\n```", content, re.DOTALL)
    msg = re.sub(r"```bash\s*\n.*?\n```", "", content, flags=re.DOTALL).strip()
    return cmds, msg

def get_response(client: OpenAI, messages: List[Dict[str, str]], content: str) -> Tuple[List[str], str]:
    messages.append({"role": "user", "content": content})
    print("\033[1;32m[Generating ...]\033[0m")
    resp = client.chat.completions.create(model=MODEL, messages=messages)
    resp_str = resp.choices[0].message.content
    messages.append({"role": "assistant", "content": resp_str})
    cmds, msg = parse_response(resp_str)
    if len(cmds) <= 1:
        msg = msg.replace("<think>", "\033[0m\033[90m[Thinking]")
        msg = msg.replace("</think>", f"[End thinking]\n{('-' * 150)}\033[0m\033[1;34m")
        print(f"\033[1;34m[Agent]: \n{('-' * 150)}\n{msg}\n{('-' * 150)}\n\033[0m")
    else:
        print(f"\033[1;31m[Agent]: The agent has failed to follow the rule, retrying.\033[0m")
    return cmds, msg

def feedback_response(client: OpenAI, messages: List[Dict[str, str]], user_message: str) -> Tuple[List[str], str]:
    cmds, msg = get_response(client,messages, user_message)
    while len(cmds) > 1:
        cmds, msg = get_response(client,messages, ERR_MUL)
    return cmds, msg

def task_loop(client: OpenAI, messages: List[Dict[str, str]], result: CompletedProcess) -> None:
    try:
        while True:
            exec_result = f"[Info]: System execution result [STDOUT] ({result.stdout}) [STDERR] ({result.stderr})"
            sub_cmds, sub_resp = feedback_response(client, messages, exec_result)
            if sub_resp.find("<TASK_DONE>") != -1:
                print("\033[1;32m[The task is done.]\033[0m")
                break
            for sub_cmd in sub_cmds:
                instruction = input(f"\033[1;33m[[Execute sub task] -> ({sub_cmd[:30]} {'...' if len(sub_cmd) > 30 else ''})     y/n?] >\033[0m ")
                if instruction == "y":
                    print(f"\033[1;32m[Executing ...]\033[0m")
                    result = subprocess.run(sub_cmd, shell=True, capture_output=True, text=True)
                    break
                else:
                    print("\033[1;31m[Info]: User has canceled the task.\033[0m")
                    feedback_response(client, messages, INFO_CANCEL)
                    return
    except KeyboardInterrupt:
        print("\033[1;31m[Info]: User has quit the sub task.\033[0m")
        feedback_response(client, messages, INFO_BREAK)

def react_loop(client: OpenAI, messages: List[Dict[str, str]]) -> None:
    while True:
        user_message = input("[User] :  ")
        cmds, resp = feedback_response(client, messages, user_message)
        for cmd in cmds:
            instruction = input(f"\033[1;33m[[Execute task] -> ({cmd[:30]} {'...' if len(cmd) > 30 else ''})     y/n?] >\033[0m ")
            if instruction == "y":
                print(f"\033[1;32m[Executing ...]\033[0m")
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                task_loop(client, messages, result)
            else:
                print("\033[1;31m[Info]: User has canceled the task.\033[0m")
                feedback_response(client, messages, INFO_CANCEL)
            break

def main():
    try:
        print("\033[38;2;255;165;0m", HEADER, "\033[0m")
        client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
        messages = [ {"role": "system", "content": SYS_PROMPT} ]
        print("\033[1;34m[Agent]:  How can i help you?\033[0m")
        react_loop(client, messages)
    except (EOFError, KeyboardInterrupt):
        print("\033[1;32m[Quit]\033[0m")
    except Exception as e:
        print("\033[1;31m[Err]:", e, "\033[0m")

if __name__ == "__main__":
    main()
