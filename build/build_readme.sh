#!/bin/bash

python3 parse_xml.py
cp title.md README.md
cat introduction.md >> README.md
cat commands_header.md >> README.md
cat commands.md >> README.md
cat footer.md >> README.md
