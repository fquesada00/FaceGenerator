import numpy as np
import io
from pg import DB

class GeneratorDB:
    def __init__(self):
        self.db = DB(dbname="facegenerator", host='localhost', port=5432, user="facegenerator", passwd="facegenerator")

    

    def insert_z(self, z:np.ndarray, tags: list):
        return self.db.query_formatted('select insert_image(%s,%s)', (z, tags)).getresult()[0][0]

    def fetch(self, tags: list = None):
        if tags == None:
            return self.db.query('select * from search_image(array[]::text[])').dictresult()

        return self.db.query_formatted('select * from search_image(%s)', (tags,)).dictresult()
  
    def fetch_z_by_id(self, id: int):
        return self.db.query_formatted('SELECT z FROM images WHERE id = %s', (id,)).getresult()[0][0]

       

    def fetch_all(self):
        self.db.query('SELECT * FROM images')

        return self.db.getresult()

    def get_tags(self):
        res = self.db.query('select * from tags').getresult()
        return [r[0] for r in res]