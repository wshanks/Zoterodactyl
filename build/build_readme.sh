#!/bin/bash
OS="$(uname)"

if [ $OS = "Linux" ] ; then
	DIR="$( cd -P "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
elif [ $OS = "Darwin" ] ; then
	FILEPATH=$(readlink "${BASH_SOURCE[0]}")
	# Check exit status of readlink -- nonzero means BASH_SOURCE not a symlink
	if [ $? != 0 ] ; then
		FILEPATH="${BASH_SOURCE[0]}"
	fi
	DIR="$( cd -P "$(dirname "${FILEPATH}")" && pwd)"
fi

cd "${DIR}"
python3 parse_xml.py
cp title.md README.md
cat introduction.md >> README.md
cat commands_header.md >> README.md
cat commands.md >> README.md
cat footer.md >> README.md
rm introduction.md
rm commands.md
