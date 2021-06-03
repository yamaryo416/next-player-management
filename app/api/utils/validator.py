import re
from graphql import GraphQLError

def validate_blank(value):
    if value == "":
        raise GraphQLError("Value is required")
    return value

def validate_too_long(value, num):
    if len(value) > num:
        raise GraphQLError("Value is too long")

def validate_name(value):
    validate_blank(value)
    validate_too_long(value, 20)
    return value

def validate_introduction(value):
    validate_too_long(value, 100)
    return value

def validate_email(value):
    match = re.match(r'[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$', value)
    if not match:
        raise GraphQLError("Invalid Email Address")
    return value

def validate_user_password(value):
    validate_blank(value)
    if len(value) < 6:
        raise GraphQLError("Password is too short")
    return value

def validate_team_password(value):
    match = re.match(r'[0-9]{4}', value)
    if not match:
        raise GraphQLError("Password is Four Number")
    return value

def validate_post_text(value):
    validate_blank(value)
    validate_too_long(value, 100)
    return value