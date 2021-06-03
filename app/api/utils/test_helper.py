from graphql_jwt.shortcuts import get_token

def create_token_headers(user):
    token = get_token(user)
    headers = {"HTTP_AUTHORIZATION": f"JWT {token}"}
    return headers