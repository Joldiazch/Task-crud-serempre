FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN apt-get update
RUN pip install -r requirements.txt
COPY . /code/