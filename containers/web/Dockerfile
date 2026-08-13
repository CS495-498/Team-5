# *
# * This Source Code Form is subject to the terms of the Mozilla Public
# * License, v. 2.0. If a copy of the MPL was not distributed with this
# * file, You can obtain one at http://mozilla.org/MPL/2.0/.
# *

# Dockerfile for NodeJS application portion
# Make sure the node version here matches .github/workflows/build.yml for the GitHub workflow.
FROM node:20

# Create the directory for the app and give ownership to the non-root node user
RUN mkdir -p "/usr/src/app" && chown -R node:node "/usr/src/app"
WORKDIR "/usr/src/app"

# Mount the source code at this volume
# Mount instead of copy allows the auto-reload to work
VOLUME "/usr/src/app"

# Run the container as a non-root user
USER node
