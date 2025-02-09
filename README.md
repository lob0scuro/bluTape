# bluTape.net

## Installing the back end

- move into server directory and create a virtual enviornment with:

  - **"python -m venv env"**

- then install the required packages with:

  - **"pip install -r requirements.txt"**

- then initialize the database by running:

  - **"flask db init"**

- initiate migration for database by running:

  - **"flask db migrate" and flask db upgrade"**

- after database and extensions have been set you can start the flask backend server using:
  - **"flask run"**

## Installing the front end

- once flask server is running move into the client foler and install the dependancies with:

  - **"npm i"**

- then start the frontend development server with:

  - **"npm run dev"**

    - or to see the production state run:
      - **"npm run build && npm run preview"**

## View in browser

- then navigate to the provided link (running on port 5173 for development or port 4173 for build)
