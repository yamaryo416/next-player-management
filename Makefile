.PHONY:
	app test migrate pro admin django react 

app:
	docker-compose run --rm app sh -c "python manage.py startapp api"

test:
	docker-compose run --rm app sh -c "pytest -l -v -s ${app} && flake8"

migrate:
	docker-compose run --rm app sh -c "python manage.py makemigrations"
	docker-compose run --rm app sh -c "python manage.py migrate"

pro:
	docker-compose run --rm app sh -c "django-admin startproject ${pro} ."

admin:
	docker-compose run --rm app sh -c "python manage.py createsuperuser"

django:
	docker-compose run --rm app sh -c "django-admin startproject app ."

next:
	docker-compose run --rm react sh -c "npx create-next-app frontend"
