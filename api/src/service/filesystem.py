import os
from PIL import Image

directory = os.environ.get("PROJECT_PATH") + '/api/faces'
tmp_directory = directory + '/tmp'

class FileSystem:
    def __init__(self):
        self.directory = directory
        self.tmp_directory = tmp_directory
        self.__create_directory(directory)
        self.__create_directory(tmp_directory)

    def __create_directory(self, directory):
        if not os.path.exists(directory):
            os.makedirs(directory)

    def __build_img_path(self, directory: str, id: str):
        return directory + '/face_' + id + '.png'
    
    def __save_img(self, face_img, id: str, tmp = False):
        if tmp:
            directory = self.tmp_directory
        else:
            directory = self.directory
        face_img.save(self.__build_img_path(directory, id))

    def save_tmp_img(self, face_img, id: str):
        self.__save_img(face_img, id, tmp=True)

    def save_img(self, id: str):
        try:
          face_img = Image.open(self.__build_img_path(self.tmp_directory, id))
        except:
          return

        self.__save_img(face_img, id)
        os.remove(self.__build_img_path(self.tmp_directory, id))
    
    def __get_img_path(self, id, tmp = False):
        if tmp:
            directory = self.tmp_directory
        else:
            directory = self.directory

        return self.__build_img_path(directory, id)
    
    def get_tmp_img_path(self, id):
        return self.__get_img_path(id, tmp=True)

    def get_img_path(self, id):
        return self.__get_img_path(id)

    def delete_all_imgs(self):
        files = os.listdir(self.directory)
        for file in files:
            if file != 'tmp':
                os.remove(self.directory + '/' + file)

    def delete_img(self, id):
        os.remove(self.__build_img_path(self.directory, id))