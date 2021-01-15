FROM python:3.7-alpine

WORKDIR /app

COPY ./backend .

RUN pip install -r requirements.txt

EXPOSE 8080

CMD [ "python", "app.py" ]