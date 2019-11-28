const router = require('express').Router()
const db = require('../../database/config')

router.get('/', async (req, res) => {})

router.post('/', async (req, res) => {
  const { id, username } = req.body
  if (!id && !username) {
    return res.status(400).json({
      error: 'Missing required properties!',
    })
  }
  try {
    const user = { id, username }
    const [newUser] = await db('users')
      .insert(user)
      .returning(['id', 'username'])
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while processing your request.',
    })
  }
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { email, frequency } = req.body
  try {
    const [user] = await db('users').where({ id })
    if (!user) {
      return res.status(404).json({
        error: 'Could not find user with the provided id!',
      })
    }
    await db('users')
      .where({ id })
      .update({ ...user, email, frequency })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while processing your request.',
    })
  }
})

router.delete('/:id', async (req, res) => {})

module.exports = router