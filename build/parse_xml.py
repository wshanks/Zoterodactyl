#!/usr/bin/env python3
"""
Script for parsing zoterodactyl.xml (Zoterodactyl section of Pentadactyl's
plugins.xml file).
"""
from bs4 import BeautifulSoup

def clean_text(text_limb):
    """
    Clean up descriptive text XML limb by:
    * Replacing <ex> tags with their text contents wrapped with '`'.
    * Concatenating <p> tags with '\n\n'.
    * Stripping other tags.
    """
    clean_strings = []
    # loop on p tags, loop on ex tags -- insert_before and then decompose them
    # join all p tags with \n\n
    for p_tag in text_limb.find_all('p'):
        for ex_tag in p_tag.find_all('ex'):
            ex_tag.insert_before('`' + ex_tag.get_text() + '`')
            ex_tag.decompose()

        clean_strings.append(p_tag.get_text(''))

    return '\n\n'.join(clean_strings)

def main():
    """
    Main function called when script is run
    """
    with open('zoterodactyl.xml', 'r') as xml_file:
        xml = xml_file.read()

    soup = BeautifulSoup(markup=xml)

    with open('introduction.md', 'w') as intro:
        intro_text = soup.plugin.find_next('p').get_text('\n\n')
        intro.write('{0}\n\n'.format(intro_text))

    with open('commands.md', 'w') as commands:
        for item in soup.findAll('item'):
            description = clean_text(item)
            commands.write('__{0}:__ {1}\n\n'.format(item.spec.text,
                                                     description))

if __name__ == "__main__":
    main()
