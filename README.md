# werewolf
## Start
From root `docker-compose up` 

### Manual run
Build the main.js from src/werewolf/frontend
`npm run dev` or `npm run build`

To manually run:
`docker run -p 6379:6379 -d redis:5`

After docker is started go to: 127.0.0.1

Then run each in its own console
- `python manage.py runworker werewolf-channel`
- `python manage.py runserver`

