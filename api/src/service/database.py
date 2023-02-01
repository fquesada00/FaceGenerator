import sqlite3
import numpy as np
import io
from pg import DB

def adapt_array(arr):
    out = io.BytesIO()
    np.save(out, arr)
    out.seek(0)
    return sqlite3.Binary(out.read())

def convert_array(text):
    out = io.BytesIO(text)
    out.seek(0)
    return np.load(out, allow_pickle=True)

class GeneratorDB:
    def __init__(self):
        self.db = DB(dbname="facegenerator", host='localhost', port=5432, user="facegenerator", passwd="facegenerator")

    

    def insert_z(self, z:np.ndarray, tags: list):
        return self.db.query_formatted('select insert_image(%s,%s)', (z, tags)).getresult()[0][0]

    def fetch(self, from_id: int = None, to_id: int = None, with_tags: bool = False):
        
        filters = []
        args = []
        if from_id is not None:
            filters.append('id >= %s')
            args.append(from_id)
        if to_id is not None:
            filters.append('id <= %s')
            args.append(to_id)

        if len(filters) > 0:
            filters = 'WHERE ' + ' AND '.join(filters)
        else:
            filters = ''

        if with_tags:
            query = 'SELECT id, z, tags FROM images ' + filters
        else:
            query = 'SELECT id, z FROM images ' + filters
        return self.db.query_formatted(query, args).dictresult()
  
    def fetch_z_by_id(self, id: int):
        return self.db.query_formatted('SELECT z FROM images WHERE id = %s', (id,)).getresult()[0][0]

       

    def fetch_all(self):
        self.db.query('SELECT * FROM images')

        return self.db.getresult()