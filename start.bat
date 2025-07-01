@echo off
echo M2Home Setup en Start Script
echo ===============================

echo Installing dependencies...
pip install -r requirements.txt

echo Starting M2Home application...
python main.py

pause
