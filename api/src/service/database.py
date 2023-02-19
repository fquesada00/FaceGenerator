import numpy as np
import io
import psycopg2

class GeneratorDB:
    def __init__(self):
        self.db = psycopg2.connect(dbname="facegenerator", host='localhost', port=5432, user="facegenerator", password="facegenerator")

    def insert_z(self, z:np.ndarray, tags: list):
        cur = self.db.cursor()
        cur.execute('select insert_image(%s,%s)', (z, tags))
        res = cur.fetchone()[0]
        self.db.commit()
        cur.close()
        return res

    def fetch(self, tags: list = None):
        cur = self.db.cursor()
        if tags == None:
            cur.execute('select id,z,tags  from search_image(array[]::text[])')
        else:
            cur.execute('select id,z,tags from search_image(%s)', (tags,))
        res = cur.fetchall()
        cur.close()
        res = [{'id': r[0], 'z': r[1], 'tags': r[2]} for r in res]
        return res

    def fetch_z_by_id(self, id: int):
        cur = self.db.cursor()
        cur.execute('SELECT z FROM images WHERE id = %s', (id,))
        res = cur.fetchone()[0]
        cur.close()
        return res


    def get_tags(self):
        cur = self.db.cursor()
        cur.execute('select * from tags')
        res = [r[0] for r in cur.fetchall()]
        cur.close()
        return res

    def get_user_by_username(self, username: str):
        cur = self.db.cursor()
        cur.execute('select username, password, user_role from users where username = %s', (username,))
        res = cur.fetchone()
        cur.close()
        if res is None:
            return None
        res = {'username': res[0], 'password': res[1], 'role': res[2]}
        return res