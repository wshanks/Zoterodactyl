#!/usr/bin/env python3
"""
Script for parsing zoterodactyl.xml (Zoterodactyl section of Pentadactyl's
plugins.xml file).
"""
from bs4 import BeautifulSoup

def clean_limb(text_limb):
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
        clean_strings.append(clean_text(p_tag))

    return '\n\n'.join(clean_strings)

def clean_text(tag):
    """
    Clean up the text content of tag by replacing XML markup with the
    appropriate markdown syntax. Return the text content.
    """
    replace_markdown_tags(tag, 'ex', '`')
    replace_markdown_tags(tag, 'em', '__')
    replace_link_tags(tag)

    return tag.get_text('')

def replace_markdown_tags(p_tag, m_tag_str, bounding_str):
    """
    Replace all instances of markdown tag m_tag_str within BeautifulSoup limb
    p_tag by surrounding the text content of m_tag_str with bounding_str.
    For example, replace "<em>Bold text</em>" with "__Bold text__".
    """
    for m_tag in p_tag.find_all(m_tag_str):
        m_tag.insert_before(bounding_str + m_tag.get_text() + bounding_str)
        m_tag.decompose()

def replace_link_tags(p_tag):
    """
    Replace all <link> tags with markdown formatted link text.
    """
    for link_tag in p_tag.find_all('link'):
        new_link_text = '[{}]({})'.format(link_tag.get_text(),
                                          link_tag.attrs['topic'])
        link_tag.insert_before(new_link_text)
        link_tag.decompose()

def main():
    """
    Main function called when script is run
    """
    with open('zoterodactyl.xml', 'r') as xml_file:
        xml = xml_file.read()

    soup = BeautifulSoup(markup=xml)

    with open('introduction.md', 'w') as intro:
        # Intro starts at the first p element and ends with the first
        # sibling to that p element that is not a p tag
        element = soup.plugin.find_next('p')
        while element.name == 'p':
            intro_text = clean_text(element)
            intro.write('{0}\n\n'.format(intro_text))
            element = element.find_next_sibling()

    with open('commands.md', 'w') as commands:
        for item in soup.findAll('item'):
            description = clean_limb(item)
            commands.write('__{0}:__ {1}\n\n'.format(item.spec.text,
                                                     description))

if __name__ == "__main__":
    main()
