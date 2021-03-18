const express = require('express')

const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())

const repositories = []

function checksRepositoryExists (request, response, next) {
  const { id } = request.params

  if (!repositories.some(repository => repository.id === id)) {
    return response.status(404).json({
      error: 'Repository no found'
    })
  }

  const repository = repositories.find(repository => repository.id === id)

  request.repository = repository
  return next()
}

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(201).json(repository)
})

app.put('/repositories/:id', checksRepositoryExists, (request, response) => {
  const updatedRepository = request.body
  let { repository } = request

  if (updatedRepository.likes > 0) {
    updatedRepository.likes = 0
  }

  repository = { ...repository, ...updatedRepository }

  return response.json(repository)
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  const likes = ++repositories[repositoryIndex].likes

  return response.json('likes')
})

module.exports = app
