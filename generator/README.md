# Face Generator API

Face Generator API built with Python using StyleGAN2.

## Setup

1. Follow the instructions in `generator/README.md` to start the StyleGAN2 application.
2. Add the following lines to `~/.bashrc`, changing path as needed

```bash
export PROJECT_PATH=~/pf-2022-face-generator
```

3. Install `virtualenv` to keep all your dependencies in one place.

```bash
apt-get install virtualenv
```

4. Create a virtual environment and activate it

```bash
cd $PROJECT_PATH/generator
virtualenv venv --python=python3.6
source venv/bin/activate
```

5. Check hardware requirements are OK

```bash
python cli.py
```

## Run

```bash
cd $PROJECT_PATH/generator
python server.py
```

When you are done executing the generator, deactivate the `virtualenv` running

```bash
deactivate
```
