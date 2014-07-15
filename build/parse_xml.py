#!/usr/bin/env python3
from bs4 import BeautifulSoup

def clean_text(text_limb):
    clean_str = ''

    # Use for tag in find_all; new_string; append

with open('zoterodactyl.xml', 'r') as f:
    xml = f.read()

soup = BeautifulSoup(markup=xml)

with open('introduction.md', 'w') as f:
    f.write('{0}\n\n'.format(soup.plugin.findNext('p').getText('\n\n')))

with open('commands.md', 'w') as f:
    for item in soup.findAll('item'):
        clean_text = item.description.getText('\n\n', strip=True)
        f.write('__{0}:__ {1}\n\n'.format(item.spec.text, clean_text))

