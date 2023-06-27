docker run --rm --workdir /usr/app -v $PWD:/usr/app node:14.21.3-alpine sh -c "yarn && yarn build"
cp -r dist ../proxy/
