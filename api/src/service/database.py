import numpy as np
import psycopg2
from src.service.tmp_database import TmpDB
from src.service.filesystem import FileSystem
import uuid
from src.service.settings import settings

EMPTY_TAG = "empty"

class GeneratorDB:
    def __init__(self):
        self.db = psycopg2.connect(dbname=settings.DB_NAME, host=settings.DB_HOST, port=settings.DB_PORT, user=settings.DB_USER, password=settings.DB_PASSWORD)
        self.tmp_db = TmpDB()
        self.fs = FileSystem()

    def __generate_id(self):
        return str(uuid.uuid4())

    def insert_face(self, image, z: list):
        id = self.__generate_id()
        self.tmp_db.insert_face(id, z)
        self.fs.save_tmp_img(image, id)
        return id
    
    def save_face(self, id: str, tags: list, serie_id: str = None):
        z = self.tmp_db.get_z_by_id(id)
        if z == None:
            return None
        
        self.tmp_db.remove_face(id)

        # remove empty tag as we only use it if no other tags are present
        if EMPTY_TAG in tags:
            tags.remove(EMPTY_TAG)

        cur = self.db.cursor()
        cur.execute('SELECT insert_image(%s, %s, %s, %s)', (id, z, tags, serie_id))
        self.db.commit()
        cur.close()        
        
        self.fs.save_img(id)

        return id

    def face_exists(self, id: str):
        cur = self.db.cursor()
        cur.execute('SELECT id FROM images WHERE id = %s', (id,))
        res = cur.fetchone()
        cur.close()
        return res != None

    def insert_serie(self, faces_id: list):
        id = self.__generate_id()
        self.tmp_db.insert_serie(id, faces_id)
        return id

    def save_serie(self, id: str, tags: list):
        faces_id = self.tmp_db.get_faces_id_by_serie_id(id)
        if faces_id == None:
            return None
        
        # remove empty tag as we only use it if no other tags are present
        if EMPTY_TAG in tags:
            tags.remove(EMPTY_TAG)

        for face_id in faces_id:
            if not self.face_exists(face_id):
              self.save_face(face_id, tags, id)

        self.tmp_db.remove_serie(id)

        cur = self.db.cursor()
        cur.execute('SELECT insert_serie(%s, %s, %s)', (id, faces_id, tags))
        self.db.commit()
        cur.close() 

        return id

    def get_image_path(self, id: str):
        if self.tmp_db.face_exists(id):
            return self.fs.get_tmp_img_path(id)
        else:
            return self.fs.get_img_path(id)
            
    def insert_z(self, id: str, tags: list):
        z = self.tmp_db.get_z_by_id(id)
        cur = self.db.cursor()
        cur.execute('INSERT INTO images (id, z) VALUES (%s, %s)', (id, z))
        res = cur.fetchone()[0]
        self.db.commit()
        cur.close()
        return res

    def get_face_by_tags(self, tags: list = None):
        cur = self.db.cursor()

        if tags is None:
          cur.execute('SELECT id, tags \
            FROM image_tags_view')
        else:
          tags = [t.lower() for t in tags]

          cur.execute('SELECT id, tags \
            FROM image_tags_view \
            WHERE %s::varchar(64)[] <@ tags', (tags,)
          )

        res = cur.fetchall()
        cur.close()

        res = [{'id': r[0], 'tags': r[1]} for r in res]

        return res

    def get_series_by_tags(self, tags: list = None):
        cur = self.db.cursor()

        if tags is None:
          cur.execute('SELECT id, images_id, tags \
            FROM series_tags_view')
        else:
          tags = [t.lower() for t in tags]

          cur.execute('SELECT id, images_id, tags \
            FROM series_tags_view \
            WHERE %s::varchar(64)[] <@ tags', (tags,)
          )

        res = cur.fetchall()
        cur.close()

        res = [{'id': r[0], 'images_id': r[1], 'tags': r[2]} for r in res]

        return res

    def fetch_z_by_id(self, id: str):
        cur = self.db.cursor()
        cur.execute('SELECT z FROM images WHERE id = %s', (id,))
        res = cur.fetchone()[0]
        cur.close()
        return res

    def get_tags(self):
        cur = self.db.cursor()
        cur.execute('select tag from tags')
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

    def delete_all_series(self):
        cur = self.db.cursor()
        cur.execute('DELETE FROM series')
        self.db.commit()
        cur.close()

    def delete_serie_by_id(self, id: str):
        cur = self.db.cursor()
        cur.execute('DELETE FROM series WHERE id = %s', (id,))
        self.db.commit()
        cur.close()

    def delete_all_faces(self):
        cur = self.db.cursor()
        cur.execute('DELETE FROM images')
        self.db.commit()
        cur.close()

        self.tmp_db.delete_all_imgs()

    def delete_face_by_id(self, id: str):
        cur = self.db.cursor()
        cur.execute('DELETE FROM images WHERE id = %s', (id,))
        self.db.commit()
        cur.close()

        self.tmp_db.delete_img(id)

    def delete_all_tags(self):
        cur = self.db.cursor()
        cur.execute('DELETE FROM tags')
        self.db.commit()
        cur.close()
