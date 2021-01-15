FROM python:3.7.9

WORKDIR /app

COPY ./backend/requirements.txt .

RUN pip install -r requirements.txt

COPY ./backend .

EXPOSE 8080

CMD [ "python", "app.py" ]