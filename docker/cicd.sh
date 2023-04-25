docker login -u ${{ github.actor }} -p ${{ secrets.GITHUB_TOKEN }} ghcr.io && 
docker pull ghcr.io/thirdeye-dev/thirdeye:latest && 
docker-compose down && 
docker-compose -f ${CODE_PATH}/docker/demo.yml up -d