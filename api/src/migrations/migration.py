import psycopg2
from src.service.settings import settings

class Migration:
    def __init__(self):
        self.db = psycopg2.connect(dbname=settings.DB_NAME, host=settings.DB_HOST, port=settings.DB_PORT, user=settings.DB_USER, password=settings.DB_PASSWORD)

    def __log__(self, msg):
        print(f'[MIGRATION] {msg}')

    def run(self, func):
        cur = self.db.cursor()

        self.__log__('Running')

        func(cur)
        self.db.commit()
        cur.close()

        self.__log__('Done')