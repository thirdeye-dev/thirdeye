# ThirdEye 

Your smart contracts can be and will be pwned sometime. You should be allowed to get to know about it first.

## Docker set-up

```
cd docker/
cp .env.template .env
docker-compose up
```

## Frontend Setup

```
cd frontend
yarn install
yarn run dev
```

## pgadmin setup

```
cd docker/
cp .pgadmin.env.template .pgadmin.env
docker-compose -f docker-compose.yml pgadmin.override.yml up
```

## flower setup

Still to be finished. Breaks celery at the moment.

```
cd docker/
docker-compose -f docker-compose.yml flower.override.yml up
```


