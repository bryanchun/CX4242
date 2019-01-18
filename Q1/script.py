import http.client
import json
import time
import sys
import collections


TMDB_ENDPOINT_PREFIX = 'api.themoviedb.org/3'  # 'movie/76341?api_key='


# Parses API key
# Tutorial at: https://www.tutorialspoint.com/python3/python_command_line_arguments.htm
# Retrieve at: https://www.themoviedb.org/settings/api and login
def print_args():
    # argv[0] is filename
    print(sys.argv)
    print('print_args: There are {} arguments'.format(len(sys.argv)))

print_args()


def api_key():
    if sys.argv[1] is not None:
        return sys.argv[1]
    else:
        return 'no-api-key'

connection = http.client.HTTPSConnection(TMDB_ENDPOINT_PREFIX, timeout=10)
# connection.connect()


# Retrieve movie static genre-id map at: https://developers.themoviedb.org/3/genres/get-movie-list
def get_genre_ids():
    url = '/genre/movie/list?' + '='.join(['api_key', api_key()])
    print(url)
    connection.request('GET', url)
    response = connection.getresponse()
    print(response.status, response.reason)
    data = response.read()
    print(data)

# TODO: Make HTTP(S) Request and get Response
# Official doc at: https://docs.python.org/3/library/http.client.html
# Tutorial at: https://www.journaldev.com/19213/python-http-client-request-get-post
get_genre_ids()
# connection.request('GET', TMDB_ENDPOINT_PREFIX + api_key(), )

connection.close()