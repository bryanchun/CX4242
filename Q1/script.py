import http.client
import json
import time
import sys
import collections


class TMDb:
    def __init__(self):
        self.TMDB_ENDPOINT = 'api.themoviedb.org'
        self.csv_files = ['./Q1/movie_ID_name.csv', './Q1/movie_ID_sim_name.csv']
        self.GENRE = 'Drama'
        self.connection = http.client.HTTPSConnection(self.TMDB_ENDPOINT, timeout=10)
        self.connection.connect()

    """
    Utility functions
    """
    def close(self):
        self.connection.close()

    def api_key(self):
        """
        Parses API key
        Tutorial at: https://www.tutorialspoint.com/python3/python_command_line_arguments.htm
        Retrieve at: https://www.themoviedb.org/settings/api and login
        """
        if sys.argv[1] is not None:
            return sys.argv[1]
        else:
            return 'no-api-key'

    def request_get(self, url):
        print(url)
        self.connection.request('GET', url)
        response = self.connection.getresponse()
        print(response.status, response.reason)
        data = response.read()
        # print(data)
        _json = json.loads(data.decode('utf-8'))                # load as json dictionary
        # print(json.dumps(_json, indent=4, sort_keys=True))   # dump as formatted string
        return _json

    """
    Q1.1: Part a
    """
    # Retrieve movie static genre-id map at: https://developers.themoviedb.org/3/genres/get-movie-list
    def get_genre_ids(self):
        """
        Gets list of id-genre pairs
        :param query_genres:
        :return: [{"id": id, "name": name}]
        """
        url = f'/3/genre/movie/list?api_key={self.api_key()}'
        return self.request_get(url)

    def get_genre_id(self, genre):
        ids = self.get_genre_ids()
        # print(ids)
        return str([obj for obj in ids['genres'] if obj['name'] == genre][0]['id'])

    """
    Q1.1: Part b
    """
    def collect_page_data(self, page_number):
        """

        :param page_number: string of page number from '1' to '100'
        :return: json
        """
        genre = self.get_genre_id(self.GENRE)
        url = '/3/discover/movie?' + '&'.join([f'api_key={self.api_key()}', 'sort_by=popularity.desc',
                                               f'page={page_number}',
                                               'primary_release_date.gte=2014-01-01',
                                               f'with_genres={genre}'])
        return self.request_get(url)

    def aggregate_data(self):
        '''
        To exactly 350 movies
        1. collect_data
        2. count movies
        3. add to csv up to remaining total count
        4. add to total count
        5. repeat if not enough
        '''
        file_flag = 0
        self.csv_clear(file_flag)

        page, total = 0, 350
        while total > 0:
            page += 1
            if page not in range(1, 101):
                print(f'aggregate_data: page_number {page} is out of range')
            _json = self.collect_page_data(str(page))
            movies = _json['results']
            id_name_pairs = list(map(lambda obj: (str(obj['id']), obj['title'].encode('utf-8')), movies))

            surplus = total - len(movies)
            added = len(movies) if surplus >= 0 else total

            self.csv_append(id_name_pairs[:added], file_flag)
            total -= added
            time.sleep(0.5)
            # count how many movies needed
            # append to csv as needed
            # decrement total
            # time.sleep()
            # 40 requests every 10 seconds, 1 seconds 4 requests, 0.25 seconds per request, safe measure: sleep 0.5 seconds
            # TODO BUG in csv.write(','.join([field1, field2]) + '\n'): "title": "Pok\u00e9mon the Movie: I Choose You!",

    def csv_append(self, data, file_flag):
        """

        :param file_flag: integer index for self.csv_files
                with 0 for './Q1/movie_ID_name.csv' and 1 for './Q1/movie_ID_sim_name.csv'
        :param data: a list of string field pairs to be recorded as 2-tuples in csv
        :return:
        """
        with open(self.csv_files[file_flag], 'a') as csv:    # to append, use mode 'a'; to overwrite, use mode 'w'
            if file_flag == 0:
                for (field1, field2) in data:
                    csv.write(','.join([field1, field2]) + '\n')
            elif file_flag == 1:
                csv.write(','.join(['389868', '495650']) + '\n')
            # else: do nothing for invalid flags

    def csv_read(self, file_flag):
        with open(self.csv_files[1], 'r') as csv:
            pass
        # generator pattern for retrieve_similar_movies
        # vs whole data copy for deduplicate_similar_movies --- or maintain set collection

    def csv_clear(self, file_flag):
        open(self.csv_files[file_flag], 'w').close()

    """
    Q1.1: Part c
    """
    def retrieve_similar_movies(self, movie_id):
        """
        Up to 5
        :param movie_id: string of movie_id
        :return:
        """
        url = f'/3/movie/{movie_id}/similar?api_key={self.api_key()}'
        res = self.request_get(url)
        # print(res)
        # 1. Count movies
        # 2. Chop up to 5 movies

    def deduplicate_similar_movies(self):
        pass
        # collections.Set


if __name__ == '__main__':
    tmdb = TMDb()
    # print(tmdb.get_genre_id('Drama'))
    # print(json.dumps(tmdb.get_genre_ids(), indent=4, sort_keys=True))
    # t = tmdb.collect_page_data('1')
    # print(type(t))
    # print('has id', t['results'][0]['id'])
    # print(len(t['results']))

    tmdb.aggregate_data()
    # tmdb.retrieve_similar_movies('9741')
    tmdb.close()
