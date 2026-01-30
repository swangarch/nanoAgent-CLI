#!/bin/bash

python -m venv venv

source venv/bin/activate

pip install --upgrade pip

pip install -r requirements.txt

echo "Use source/bin/activate to enter virtual enviroment."