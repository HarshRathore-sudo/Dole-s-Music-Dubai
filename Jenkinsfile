pipeline {
    agent any
    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
    }
    environment {
        IMAGE = 'localhost:5000/cc-prod-70ff4741'
        DEPLOY_HOST = '152.67.9.249'
        DEPLOY_USER = 'ubuntu'
        DEPLOY_PORT = '44725'
        SSH_PORT = '22'
        CONTAINER = 'cc-prod-70ff4741'
    }
    stages {
        stage('Prepare') {
            steps {
                // Pull project files from SDK server via SSH.
                // Works for all projects regardless of git/SCM setup.
                sh """
                    ssh -o StrictHostKeyChecking=no -i /var/lib/jenkins/.ssh/sdk_access_key root@149.5.247.109 \\
                      "tar czf - -C /opt/claude-code-api/projects/default/Dole-s-Music-Dubai/8b133ffe-a3e9-4e73-96db-7b9f8b6bd9ac --exclude=.git --exclude=node_modules --exclude=__pycache__ --exclude=.next --exclude=.venv --exclude=venv --exclude=.cache --exclude=.config --exclude=.local --exclude='*.pyc' ." \\
                      | tar xzf - -C \${WORKSPACE}/
                    ls -la \${WORKSPACE}/
                """
            }
        }
        stage('Sanitize Config') {
            steps {
                // CRITICAL: Strip any HTTPS redirect middleware that AI may have added.
                // SSL termination is handled by system nginx, NOT Traefik.
                // Adding redirect middleware causes an infinite redirect loop.
                // Also fix Next.js healthcheck: /api/health is NOT in standalone builds.
                sh """
                    cd \${WORKSPACE}
                    echo "=== Sanitizing docker-compose.prod.yml ==="
                    sed -i '/redirect-https/d' docker-compose.prod.yml
                    sed -i '/redirectscheme/d' docker-compose.prod.yml
                    sed -i '/ACME cert issuance/d' docker-compose.prod.yml
                    sed -i 's|http://127.0.0.1:3000/api/health|http://127.0.0.1:3000/|g' docker-compose.prod.yml
                    echo "Sanitization complete"
                    grep -c 'redirect' docker-compose.prod.yml && echo "WARNING: redirect still found!" || echo "OK: no redirects"
                """
            }
        }
        stage('Validate') {
            steps {
                // Validate docker-compose.prod.yml syntax and config.
                // Catches YAML errors, invalid service references, and
                // interpolation issues BEFORE building anything.
                sh """
                    cd \${WORKSPACE}
                    echo "=== Validating docker-compose.prod.yml ==="
                    docker compose -f docker-compose.prod.yml config --quiet
                    echo "Compose config: VALID"
                """
            }
        }
        stage('CI Build and Smoke Test') {
            steps {
                // Prune Docker build cache to prevent stale files from deleted code
                // persisting in cached layers and causing compilation errors.
                sh """
                    echo "=== Cleaning project images and build cache ==="
                    docker images --filter "reference=localhost:5000/cc-prod-70ff4741*" --format '{{.ID}}' | xargs docker rmi -f 2>/dev/null || true
                    docker images --filter "reference=*cc-prod-70ff4741*" --format '{{.ID}}' | xargs docker rmi -f 2>/dev/null || true
                    docker builder prune --all -f 2>/dev/null || true
                    echo "Image and cache cleanup complete"
                """
                // Build images and run a smoke test ON JENKINS (not on prod).
                // This catches: Dockerfile build errors, missing dependencies,
                // container crash-on-start, broken health checks — all before
                // touching the production server.
                sh """
                    cd \${WORKSPACE}
                    echo "=== Building images locally (CI) ==="
                    docker compose -f docker-compose.prod.yml build --no-cache
                """
                sh """
                    cd \${WORKSPACE}
                    echo "=== Starting containers for smoke test ==="
                    docker network create traefik-public 2>/dev/null || true
                    docker compose -f docker-compose.prod.yml -p ${CONTAINER}-ci up -d --remove-orphans
                """
                // Wait for at least one healthy container (2 min max).
                // Shorter timeout than prod health check — this is just a smoke test.
                sh """
                    PASSED=0
                    for i in \$(seq 1 12); do
                        HEALTHY=\$(docker compose -f \${WORKSPACE}/docker-compose.prod.yml -p ${CONTAINER}-ci ps 2>/dev/null | grep -c healthy || echo 0)
                        echo "CI smoke test: \$HEALTHY healthy (attempt \$i/12)"
                        if [ "\$HEALTHY" -gt 0 ] 2>/dev/null; then
                            echo "CI smoke test PASSED"
                            PASSED=1
                            break
                        fi
                        sleep 10
                    done
                    if [ "\$PASSED" -eq 0 ]; then
                        echo "=== CI SMOKE TEST FAILED ==="
                        echo "=== Container status ==="
                        docker compose -f \${WORKSPACE}/docker-compose.prod.yml -p ${CONTAINER}-ci ps -a || true
                        echo "=== Container logs ==="
                        docker compose -f \${WORKSPACE}/docker-compose.prod.yml -p ${CONTAINER}-ci logs --tail=30 || true
                        docker compose -f \${WORKSPACE}/docker-compose.prod.yml -p ${CONTAINER}-ci down --remove-orphans --volumes 2>/dev/null || true
                        exit 1
                    fi
                """
                // Save built Docker images for transfer to prod (single-build architecture).
                // Images are built ONCE on Jenkins — no build on prod server.
                // We retag any CI-namespaced (${CONTAINER}-ci-*) image with a prod-friendly
                // name so prod compose finds it via `up --no-build`. Externally-pulled images
                // (postgres, nginx) are saved too — small overhead, simpler/more robust than
                // parsing the compose file.
                sh """
                    cd \${WORKSPACE}
                    echo "=== Collecting images to ship ==="
                    CI_IMAGES=\$(docker compose -f docker-compose.prod.yml -p ${CONTAINER}-ci config --images 2>/dev/null | sort -u)
                    if [ -z "\$CI_IMAGES" ]; then
                        echo "ERROR: compose config returned no images"
                        exit 1
                    fi
                    PROD_IMAGES=""
                    for ci_img in \$CI_IMAGES; do
                        case "\$ci_img" in
                            ${CONTAINER}-ci-*)
                                # Auto-generated CI image — retag for prod project name.
                                prod_img=\$(echo "\$ci_img" | sed "s|^${CONTAINER}-ci-|${CONTAINER}-|")
                                case "\$prod_img" in *:*) ;; *) prod_img="\$prod_img:latest";; esac
                                docker tag "\$ci_img" "\$prod_img" && echo "Retagged \$ci_img -> \$prod_img"
                                PROD_IMAGES="\$PROD_IMAGES \$prod_img"
                                ;;
                            *)
                                # Explicit image: in compose, or external base image — save as-is.
                                case "\$ci_img" in *:*) ;; *) ci_img="\$ci_img:latest";; esac
                                PROD_IMAGES="\$PROD_IMAGES \$ci_img"
                                ;;
                        esac
                    done
                    echo "=== Saving Docker images for prod transfer ==="
                    docker save \$PROD_IMAGES | gzip > /tmp/${CONTAINER}-images.tar.gz
                    echo "Saved images:\$PROD_IMAGES"
                    ls -lh /tmp/${CONTAINER}-images.tar.gz
                """
                // Tear down CI containers — smoke test passed, images saved.
                sh """
                    docker compose -f \${WORKSPACE}/docker-compose.prod.yml -p ${CONTAINER}-ci down --remove-orphans --volumes 2>/dev/null || true
                    echo "CI cleanup complete"
                """
            }
        }
        stage('Deploy') {
            steps {
                sshagent(credentials: ['ssh-cc-prod-70ff4741']) {
                    // Ensure swap exists on prod (prevents OOM during deploys).
                    // Non-fatal: if swap creation fails (no disk space, no sudo), continue anyway.
                    sh """
                        ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                          "swapon --show 2>/dev/null | grep -q /swapfile && echo 'Swap exists' || \\
                           (sudo fallocate -l 4G /swapfile 2>/dev/null && sudo chmod 600 /swapfile && \\
                            sudo mkswap /swapfile && sudo swapon /swapfile && echo 'Swap created' || \\
                            echo 'Swap creation failed (non-fatal)')" || true
                    """
                    // Transfer source files to prod
                    sh """
                        tar czf /tmp/${CONTAINER}-src.tar.gz -C \${WORKSPACE} .
                        ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ~/deployments/${CONTAINER}"
                        scp -o StrictHostKeyChecking=no -P ${SSH_PORT} /tmp/${CONTAINER}-src.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/
                        ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} "cd ~/deployments/${CONTAINER} && rm -rf apps packages backend frontend src nginx *.json *.yaml *.yml *.ts Dockerfile* Makefile 2>/dev/null; tar xzf /tmp/${CONTAINER}-src.tar.gz && rm /tmp/${CONTAINER}-src.tar.gz"
                        rm -f /tmp/${CONTAINER}-src.tar.gz
                    """
                    // Transfer the pre-built image tarball from CI to prod.
                    // Single-build architecture: build on Jenkins, ship to prod.
                    // Avoids running pip/npm install on the small prod VM (was OOMing).
                    sh """
                        if [ ! -f /tmp/${CONTAINER}-images.tar.gz ]; then
                            echo "ERROR: no image tarball at /tmp/${CONTAINER}-images.tar.gz"
                            exit 1
                        fi
                        echo "=== Transferring built images to prod ==="
                        ls -lh /tmp/${CONTAINER}-images.tar.gz
                        scp -o StrictHostKeyChecking=no -P ${SSH_PORT} /tmp/${CONTAINER}-images.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:/tmp/
                    """
                    // Tag current images as :rollback before loading new ones.
                    // Strip existing tag before adding :rollback to avoid invalid name:tag:tag.
                    sh """
                        ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                          'cd ~/deployments/${CONTAINER} && \\
                           echo "=== Tagging current images as :rollback ===" && \\
                           IMGS=\$(docker compose -f docker-compose.prod.yml config --images 2>/dev/null | tr "\n" " ") && \\
                           for img in \$IMGS; do \\
                             base=\$(echo \$img | cut -d: -f1); \\
                             docker tag \$img \${base}:rollback 2>/dev/null && echo "Tagged \${base}:rollback" || true; \\
                           done'
                    """
                    // Load pre-built images on prod and bring up the stack WITHOUT rebuilding.
                    // Image names produced on Jenkins (${CONTAINER}-<svc>:latest) match
                    // what compose looks for on prod (project name = directory = ${CONTAINER}).
                    sh """
                        ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                          "docker network create traefik-public 2>/dev/null || true && \\
                           cd ~/deployments/${CONTAINER} && \\
                           echo '=== Bringing down old stack ===' && \\
                           docker compose -f docker-compose.prod.yml down 2>/dev/null || true && \\
                           echo '=== Loading pre-built images from CI ===' && \\
                           gunzip -c /tmp/${CONTAINER}-images.tar.gz | docker load && \\
                           rm -f /tmp/${CONTAINER}-images.tar.gz && \\
                           echo '=== Pulling external base images (postgres, nginx, etc.) ===' && \\
                           docker compose -f docker-compose.prod.yml pull --ignore-buildable 2>/dev/null || true && \\
                           echo '=== Starting containers (no build on prod) ===' && \\
                           docker compose -f docker-compose.prod.yml up -d --no-build --remove-orphans && \\
                           echo 'Containers started'"
                    """
                    // Clean up local image tarball from Jenkins
                    sh "rm -f /tmp/${CONTAINER}-images.tar.gz 2>/dev/null || true"
                }
            }
        }
        stage('Health Check') {
            steps {
                sshagent(credentials: ['ssh-cc-prod-70ff4741']) {
                    sh """
                        for i in \$(seq 1 18); do
                            HEALTHY=\$(ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                              "cd ~/deployments/${CONTAINER} && docker compose -f docker-compose.prod.yml ps 2>/dev/null | grep -c healthy || echo 0")
                            echo "Healthy containers: \$HEALTHY (attempt \$i/18)"
                            if [ "\$HEALTHY" -gt 0 ] 2>/dev/null; then
                                echo "=== Deployment healthy — cleaning up old images ==="
                                ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                                  "docker images --filter \"reference=*${CONTAINER}*:rollback\" --format '{{.ID}}' | xargs docker rmi -f 2>/dev/null || true && \\
                                   docker image prune -f 2>/dev/null || true"
                                echo "Deployment healthy!"
                                exit 0
                            fi
                            sleep 10
                        done
                        echo "Health check failed after 3 minutes"
                        exit 1
                    """
                }
            }
        }
    }
    post {
        always {
            // Clean up any leftover CI containers, images, and tarballs
            sh """
                docker compose -f \${WORKSPACE}/docker-compose.prod.yml -p ${CONTAINER}-ci down --remove-orphans --volumes 2>/dev/null || true
                docker images --filter "reference=*${CONTAINER}*" --format '{{.ID}}' | xargs docker rmi -f 2>/dev/null || true
                docker rmi ${IMAGE}:${BUILD_NUMBER} 2>/dev/null || true
                rm -f /tmp/${CONTAINER}-images.tar.gz /tmp/${CONTAINER}-src.tar.gz 2>/dev/null || true
            """
            cleanWs()
        }
        failure {
            sshagent(credentials: ['ssh-cc-prod-70ff4741']) {
                sh """
                    echo "=== CONTAINER STATUS ==="
                    ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                      "cd ~/deployments/${CONTAINER} && docker compose -f docker-compose.prod.yml ps -a" 2>/dev/null || true
                    echo "=== SERVICE LOGS ==="
                    ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${DEPLOY_USER}@${DEPLOY_HOST} \\
                      "cd ~/deployments/${CONTAINER} && docker compose -f docker-compose.prod.yml logs --tail=20" 2>/dev/null || true
                """
            }
            echo "Failed ${IMAGE}:${BUILD_NUMBER}"
        }
        success { echo "Deployed ${IMAGE}:${BUILD_NUMBER}" }
    }
}