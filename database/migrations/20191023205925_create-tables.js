exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table
        .string('id')
        .primary()
        .unique()
        .notNullable()
      table.string('username').notNullable()
      table
        .string('email')
        .unique()
        .notNullable()
      table
        .enum('frequency', ['daily', 'weekly', 'monthly'])
        .default('weekly')
        .notNullable()
    })
    .createTable('things', table => {
      table.string('id').notNullable()
      table.string('subreddit')
      table.text('selftext')
      table.string('author_fullname')
      table.string('title')
      table.string('subreddit_name_prefixed')
      table.string('name')
      table.string('category')
      table.integer('score')
      table.string('thumbnail')
      table.boolean('over_18')
      table.string('author')
      table.string('permalink')
      table.string('url')
      table.bigInteger('created_utc')
      table.boolean('surfaced').default(false)
      table
        .string('user_id')
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')
      table.primary(['id', 'user_id'])
    })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('things').dropTableIfExists('users')
}
