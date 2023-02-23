from src.service.settings import settings
from redis import Redis

class TmpDB:
    def __init__(self):
        self.redis = Redis(host=settings.TMP_DB_HOST, port=settings.TMP_DB_PORT, db=0)
    
    def __get_faces_key(self):
        return 'faces'

    def __get_expire(self):
        return settings.TMP_DB_MINUTES_EXPIRATION
    
    def __build_composite_key(self, key: str, id: str):
        return key + ':' + id

    def insert_face(self, id: str, z: list):
        z_str = ','.join([str(x) for x in z])
        self.redis.set(self.__build_composite_key(self.__get_faces_key(), id), z_str, ex=self.__get_expire())

    def get_z_by_id(self, id: str):
        face = self.redis.get(self.__build_composite_key(self.__get_faces_key(), id))
        if face == None:
            return None

        return [float(x) for x in face.decode('utf-8').split(',')]

    def remove_face(self, id: str):
        self.redis.delete(self.__build_composite_key(self.__get_faces_key(), id))
        
    def face_exists(self, id: str):
        return self.redis.exists(self.__build_composite_key(self.__get_faces_key(), id))

    def __get_series_key(self):
        return 'series'

    def insert_serie(self, id: str, faces_id: list):
        faces_id_str = ','.join(faces_id)
        self.redis.set(self.__build_composite_key(self.__get_series_key(), id), faces_id_str, ex=self.__get_expire())

    def get_faces_id_by_serie_id(self, id: str):
        serie = self.redis.get(self.__build_composite_key(self.__get_series_key(), id))
        if serie == None:
            return None

        return serie.decode('utf-8').split(',')

    def remove_serie(self, id: str):
        self.redis.delete(self.__build_composite_key(self.__get_series_key(), id))

    def serie_exists(self, id: str):
        return self.redis.exists(self.__build_composite_key(self.__get_series_key(), id))