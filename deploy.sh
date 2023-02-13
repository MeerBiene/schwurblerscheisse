#!/bin/bash
cd app &&\
rm -rf dist &&\
npm ci &&\
npm run build &&\
cd .. &&\
docker-compose up
