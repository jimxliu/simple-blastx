# simple-blastx
A web application that can determine whether a particular DNA strand encodes a portion of a protein in a well-known set.

## Local deployment
```docker-compose up --build```
Note that you might need to change the env variable `REACT_APP_BACKEND_URI` value from `/api` to `http://192.168.99.101/api` in `REACT_APP_BACKEND_URI` in `docker-compose.yaml`, if you are using `Docker Quickstart Terminal on Windows`.

## Cloud
For convenience, I just deployed this app to AWS EC2. The DevOps process can be further optimized using CodePipeline or other automation tools.
