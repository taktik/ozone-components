#!/usr/bin/env bash

JSON_FILES=$@

# Process all files
for JSON_FILE in $JSON_FILES; do
	if [ -r $JSON_FILE ]; then
		# Prepare JQ command
		JQ_CMD=""

		# Process all keys
		KEYS=`jq -r -c 'path(..)|[.[]|tostring]|join("/")' $JSON_FILE`
		for KEY in $KEYS; do
			# Build environment key
			ENV_KEY=${KEY^^}
			ENV_KEY=${ENV_KEY//\//_}

			# Check if environment variable is defined
			if [ -v "$ENV_KEY" ]; then
				# Build jq path
				JQ_PATH="."
				IFS='/' read -r -a PARTS <<< $KEY
				for PART in "${PARTS[@]}"; do
	                JQ_PATH+="[\"$PART\"]"
	            done

				# Complete JQ command
				[ "$JQ_CMD" != "" ] && JQ_CMD+=" | "
				JQ_CMD+="${JQ_PATH} = env.$ENV_KEY"
			fi
		done

		# Execute JQ command
		JQ_CMD="jq -M '${JQ_CMD:-.}' $JSON_FILE"
		eval $JQ_CMD > ${JSON_FILE}.tmp
		cat ${JSON_FILE}.tmp > $JSON_FILE
		rm ${JSON_FILE}.tmp
	fi
done