#!/bin/python3

from openai import OpenAI
from dotenv import load_dotenv
import subprocess
import re
import os
from typing import List, Dict, Tuple
from subprocess import CompletedProcess


def readfile(file: str) -> str:
    with open(file, mode="r") as f:
        s = f.read()
        return s


def get_response(client: OpenAI, messages: List[Dict[str, str]], content: str) -> Tuple[List[str], str]:
    messages.append({"role": "user", "content": content})
    response = client.chat.completions.create(model=MODEL, messages=messages)
    print("[Generating ...]")
    resp_str = response.choices[0].message.content
    messages.append({"role": "assistant", "content": resp_str})

    cmds, msg = parse_response(resp_str)
    print(f"\033[34m[Agent]: {msg}\033[0m")
    return cmds, msg


def parse_response(content: str) -> tuple:
    cmds = re.findall(r"```bash\n(.*?)\n```", content, re.DOTALL)
    msg = re.sub(r"```bash\s*\n.*?\n```", "", content, flags=re.DOTALL).strip()
    return cmds, msg


def task_loop(client: OpenAI, messages: List[Dict[str, str]], result: CompletedProcess) -> None:
    while True:
        exec_result = f"[INFO]: System execution result [STDOUT] ({result.stdout}) [STDERR] ({result.stderr})"
        sub_cmds, sub_resp = feedback_response(client, messages, exec_result)
        if sub_resp.find("<TASK_DONE>") != -1:
            print("\033[32mThe task is done.\033[0m")
            break
        for sub_cmd in sub_cmds:
            instruction = input(f"\033[33m[Execute sub task] -> ({sub_cmd[:30]} {'...' if len(sub_cmd) > 30 else ''})     y/n? >\033[0m ")
            if instruction == "y":
                result = subprocess.run(sub_cmd, shell=True, capture_output=True, text=True)
                break
            else:
                print("User has canceled the task.")
                feedback_response(client, messages, INFO_CANCEL)
                return


def feedback_response(client: OpenAI, messages: List[Dict[str, str]], user_message: str) -> Tuple[List[str], str]:
    cmds, msg = get_response(client,messages, user_message)
    while len(cmds) > 1:
        cmds, msg = get_response(client,messages, ERR_MUL)
    return cmds, msg


def react_loop(client: OpenAI, messages: List[Dict[str, str]]) -> None:
    while True:
        user_message = input("[User] :  ")
        cmds, resp = feedback_response(client, messages, user_message)
        for cmd in cmds:
            instruction = input(f"\033[33m[Execute task] -> ({cmd[:30]} {'...' if len(cmd) > 30 else ''})     y/n? >\033[0m ")
            if instruction == "y":
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                task_loop(client, messages, result)
            else:
                print("User has canceled the task.")
                feedback_response(client, messages, INFO_CANCEL)
                break


load_dotenv()
API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
MODEL = os.getenv("MODEL")
SYS_PROMPT = readfile("sys_prompt.txt")
INFO_CANCEL = "[INFO]: User has cancelled the operation."
ERR_MUL = "[Error]: more than one bash block is generated in one conversation."
HEADER = readfile("header.txt")


def main():
    try:
        print("\033[38;2;255;165;0m", HEADER, "\033[0m")
        client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
        messages = [ {"role": "system", "content": SYS_PROMPT} ]
        print("[Agent]:  How can i help you?", )
        react_loop(client, messages)
    except (EOFError, KeyboardInterrupt):
        print("Quit")
    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    main()
