FROM jenkins/jenkins:lts
USER root

# Install Docker CLI and Node.js
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg lsb-release && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && \
    apt-get install -y docker-ce-cli nodejs && \
    rm -rf /var/lib/apt/lists/*

# Pre-install Jenkins plugins
RUN jenkins-plugin-cli --plugins \
    git \
    github \
    workflow-aggregator \
    workflow-multibranch \
    docker-workflow \
    credentials-binding \
    configuration-as-code \
    job-dsl

USER root
