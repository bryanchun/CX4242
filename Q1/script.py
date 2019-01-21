import http.client
import json
import time
import sys
import collections


class TMDb:
    def __init__(self):
        self.TMDB_ENDPOINT_PREFIX = 'api.themoviedb.org'
        self.connection = http.client.HTTPSConnection(self.TMDB_ENDPOINT_PREFIX, timeout=10)
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
        self.connection.request('GET', url)
        response = self.connection.getresponse()
        print(response.status, response.reason)
        data = response.read()
        _json = json.loads(data.decode('utf-8'))                # load as json dictionary
        # _json = json.dumps(_json, indent=4, sort_keys=True)   # dump as formatted string
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
        url = '/3/genre/movie/list?' + 'api_key=' + self.api_key()
        # print(url)
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

        :param page_number: string of page number from '1' t0 '100'
        :return: json
        """
        url = '/3/discover/movie?' + '&'.join(['api_key=' + self.api_key(), 'sort_by=popularity.desc',
                                               'page=' + page_number,
                                               'primary_release_date.gte=2014-01-01',
                                               'with_genres=' + self.get_genre_id('Drama')])
        return self.request_get(url)

        # json.JSONDecoder()

        # bytedata = json.dumps(bytedata, ensure_ascii=False, encoding='utf-8')
        # print(bytedata)
        # print(bytedata[1428:1433])
        # print(bytedata.decode('utf-8', errors='ignore'))
        # _json = json.loads(bytedata.encode('utf-8').decode('unicode-escape'))  # load as json dictionary
        # _json = json.loads(bytedata.decode('utf-8'))

    def aggregate_data(self):
        '''
        To exactly 350 movies
        1. collect_data
        2. count movies
        3. add to csv up to remaining total count
        4. add to total count
        5. repeat if not enough
        '''
        # time.sleep()
        # 40 requests every 10 seconds, 1 seconds 4 requests, 0.25 seconds per request, safe measure: sleep 0.5 seconds
        page, total = 0, 350
        while total > 0:
            page += 1
            json = self.collect_page_data(str(page))
            # count how many movies needed
            # append to csv as needed
            # decrement total

    def csv_write(self):
        with open('./Q1/movie_ID_name.csv', 'w') as csv:    # to append, use mode 'a'
            csv.write(','.join(['389868', 'Seoul Station']) + '\n')
            csv.write(','.join(['495650', 'Erotiquest']) + '\n')
            # csv.write('hello,csv')

    """
    Q1.1: Part c
    """
    def retrieve_similar_movie(self, movie_id):
        pass


if __name__ == '__main__':
    tmdb = TMDb()
    print(tmdb.get_genre_id('Drama'))
    tmdb.close()
