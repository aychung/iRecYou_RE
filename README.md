# iRedYou: Recommendation Engine

iRecYou Video: Recommendation Engine is a self-contained and scalable web service built for iRecYou system, a video search / recommendation application built in microservice-based architecture.

# Table of Contents

1. [Features](#iRecYou)
1. [Development](#Development)
1. [Requirements](#Requirements)
1. [Architecture](#Architecture)
    1. [iRecYou System Diagram](#iRecYou-System-Design)
    1. [Recommendation Engine Diagram](#Recommendation-Engine-Diagram)
1. [Roadmap](#Roadmap)
1. [Contributing](#Contributing)
1. [License](#License)

## Features
- Stores User and Video like relation into Neo4j Graph Database.
- Generate recommendation lists for vidoes based on user's video likes.
- Generate trending video lists based on video CTRs.

## Development

### Install Dependencies

```sh
$ npm install
```

### Usage
Start Express Server:
```sh
$ npm start
```

Start Database Worker:
```sh
$ npm run database-worker
```

Start Gen. Recommendation Worker:
```sh
$ npm run recommendation-worker
```

Start Gen. Trending List Worker:
```sh
$ npm run trendinglist-worker
```

## Requirements

- Node 8.5.x
- Redis 4.0.x
- Neo4j 3.2.x
- ELK 5.6.x
- AWS SQS / SNS

## Architecture

### iRecYou System Design
- Video search / recommendation application
- API:
  - search videos
  - get recommended videos
![System Diagram](docs/img/Thesis.png)

### Recommendation Engine Diagram
- Simplified clone of YouTube Recommender Engine
- Generates list of recommended videos upon user search query or user selecting a video.
![Recommendation Engine Diagram](docs/img/iRecYou_RE_diagram.png)

- Sample Analytics output
![Analytics Output 1](docs/img/sample_analytics_output.png)
![Analytics Output 2](docs/img/sample_analytics_output2.png)

## Roadmap

View the project roadmap [here](docs/ROADMAP.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License
MIT © [Albert Chung](https://github.com/aychung)
