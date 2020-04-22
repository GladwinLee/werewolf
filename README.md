# werewolf
## Start
Build the main.js from src/werewolf/frontend
`npm run dev` or `npm run build`

Currently need to download Docker and run Redis on port 6379
`docker run -p 6379:6379 -d redis:5`

Then run each in its own console
- `python manage.py runworker werewolf-channel`
- `python manage.py runserver`

Can use `docker-compose`