docker login -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }} ghcr.io && 
docker pull ghcr.io/thirdeye-dev/thirdeye:latest && 
cd /home/deployuser/thirdeye/docker &&
# save echo logs to logs.txt
echo "shutting down docker compose services at ${CODE_PATH}" > logs.txt &&
docker-compose down && 
docker-compose -f ${CODE_PATH}/docker/demo.yml up -d