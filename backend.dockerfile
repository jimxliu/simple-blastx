FROM python:3.7.9

WORKDIR /app

COPY ./backend .

RUN pip install -r requirements.txt

EXPOSE 8080

CMD [ "python", "app.py" ]