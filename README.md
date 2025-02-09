## Project Structure:

```
fetch_receipt-processor-challenge/
│
├── routes/                  # API routes (modularized)
├── data/                    # Potentially holds sample receipt data
└── receipt-processor-challenge-description/   # Challenge description and requirements
```

### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

Your application will be available at http://localhost:3000.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t fetch_receipt-processor-challenge`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t fetch_receipt-processor-challenge`.

Then, push it to your registry, e.g. `docker push myregistry.com/fetch_receipt-processor-challenge`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References

* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
* [JavaScript References (To solve Array.map())](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#using_parseint_with_map)